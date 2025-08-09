import React, { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';
import InputText from '@/components/input/input-text';
import { addPostEvent } from '@/features/common/postSlice';
import { convertToYouTubeTimeFormat, getCurrentTime } from '@/helper/functions';
import { timezones } from '@/helper/timezones';
import Small_exit_icon from '@/svg/small_exit_icon';

// This type would be in a separate types file ideally
interface ytChannel {
  channel_id: string;
  channel_title: string;
}

export default function YtPostCreator() {
  const dispatch = useAppDispatch();
  const dDate = useAppSelector((state) => state.date.date);

  const INITIAL_YT_POST_OBJ = {
    post_title: '',
    post_description: '',
    post_tags: '',
    post_category_id: '',
    post_scheduled_timezone: '',
    post_scheduled_date: dDate,
    post_scheduled_time: '',
  };

  const [ytPostObj, setYtPostObj] = useState(INITIAL_YT_POST_OBJ);
  const [isScheduled, setIsScheduled] = useState(false);

  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailKey, setThumbnailKey] = useState<string | null>(null); // NEW: State for thumbnail key

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState<string | null>(null); // NEW: State for video key

  // NEW: Specific loading and error states for better UX
  const [isPosting, setIsPosting] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null); // NEW: Ref for video input for reset

  const updateFormValue = (updateType: string, value: string) => {
    setYtPostObj({ ...ytPostObj, [updateType]: value });
  };

  // NEW: Function to reset the entire form state
  const resetForm = () => {
    setYtPostObj(INITIAL_YT_POST_OBJ);
    setThumbnailUrl(null);
    setThumbnailKey(null);
    setVideoUrl(null);
    setVideoKey(null);
    setIsScheduled(false);
    setError(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handlePost = async () => {
    // Basic validation
    if (!ytPostObj.post_title) {
      setError('Post title is required.');
      return;
    }
    if (!videoKey) {
      setError('A video must be uploaded before posting.');
      return;
    }

    setIsPosting(true);
    setError(null);

    try {
      const time = getCurrentTime();
      const postPublishAt = isScheduled
        ? convertToYouTubeTimeFormat(
            ytPostObj.post_scheduled_date,
            ytPostObj.post_scheduled_time,
            ytPostObj.post_scheduled_timezone
          )
        : null;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/youtube/upload/video`,
        {
          title: ytPostObj.post_title,
          description: ytPostObj.post_description,
          tags: ytPostObj.post_tags.split(',').map((tag) => tag.trim()), // Send tags as an array
          categoryId: ytPostObj.post_category_id,
          s3VideoKey: videoKey, // CHANGED: Send the key, not the URL
          s3ThumbnailKey: thumbnailKey, // CHANGED: Send the key
          privacyStatus: 'public', // This can be handled by backend based on publishAt
          publishAt: postPublishAt,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('auth-token')}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(
          addPostEvent({
            platform: 'youtube',
            time: ytPostObj.post_scheduled_time
              ? ytPostObj.post_scheduled_time
              : time,
          })
        );
        alert('Post created successfully!'); // Use a more sophisticated notification system if available
        resetForm(); // NEW: Reset form on success
      }
    } catch (err) {
      console.error('Error posting video:', err);
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        'An unexpected error occurred while posting. Please try again.';
      setError(errorMessage);
    } finally {
      setIsPosting(false);
    }
  };

  // REFACTORED with better loading and error handling
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: 'thumbnail' | 'video'
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const setLoading =
      fileType === 'thumbnail' ? setIsThumbnailUploading : setIsVideoUploading;
    const urlEndpoint =
      fileType === 'thumbnail' ? 's3ThumbnailUrl' : 's3VideoUrl';

    setLoading(true);
    setError(null);

    try {
      const fileData = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/youtube/${urlEndpoint}`,
        { file: fileData }
      );

      const { url, key } = response.data;

      await axios.put(url, selectedFile, {
        headers: { 'Content-Type': selectedFile.type },
      });

      const s3ObjectUrl = `https://captain-post-yt-bucket.s3.ap-south-1.amazonaws.com/${key}`;

      if (fileType === 'thumbnail') {
        setThumbnailUrl(s3ObjectUrl);
        setThumbnailKey(key);
      } else {
        setVideoUrl(s3ObjectUrl);
        setVideoKey(key);
      }
    } catch (err) {
      console.error(`Error uploading ${fileType}:`, err);
      const axiosError = err as AxiosError;
      let errorMessage = `Failed to upload ${fileType}. Please try again.`;
      if (axiosError.response?.status === 403) {
        errorMessage = `Upload failed: Permission denied. Please check configuration.`;
      }
      setError(errorMessage);
      // Reset file input on error
      e.target.value = '';
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!thumbnailKey) return;
    // For now, we'll just clear it from the frontend.
    // Deleting from S3 should be handled carefully, maybe after the post is successful.
    setThumbnailUrl(null);
    setThumbnailKey(null);
  };

  // ... (rest of the component logic like getImageKey if still needed)
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-screen">
      <div className="overflow-y-auto overscroll-contain px-8 pb-24 flex flex-col min-h-screen">
        {/* All inputs will now use the single state object `ytPostObj` */}
        <InputText
          type="text"
          defaultValue={ytPostObj.post_title}
          updateType="post_title"
          containerStyle="mt-2"
          labelTitle="Post title"
          placeholder="Enter Post title"
          updateFormValue={updateFormValue}
        />
        <InputText
          type="text"
          defaultValue={ytPostObj.post_category_id}
          updateType="post_category_id"
          containerStyle="mt-2"
          labelTitle="Post Category Id"
          placeholder="e.g., 22 for People & Blogs"
          updateFormValue={updateFormValue}
        />
        {/* Description and Thumbnail Section */}
        <div className="form-control mt-2">
          <label className="label text-sm text-secondary">
            Description & Thumbnail
          </label>
          <div className="border border-gray-500 rounded-lg p-2">
            <textarea
              placeholder="Type your content ..."
              className="h-32 w-full text-sm bg-transparent resize-none border-none focus:outline-none"
              value={ytPostObj.post_description}
              onChange={(e) =>
                updateFormValue('post_description', e.target.value)
              }
              required
            />
            <div className="flex items-start gap-4 mt-2">
              {thumbnailUrl && (
                <div className="relative w-28 h-28 bg-secondary rounded-lg">
                  <button
                    className="w-5 h-5 rounded-full bg-gray-500 absolute -right-1 -top-1 flex items-center justify-center"
                    onClick={handleRemoveImage}
                  >
                    <Small_exit_icon />
                  </button>
                  <img
                    className="w-full h-full object-contain rounded-lg"
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFileUpload(e, 'thumbnail')}
                  ref={imageInputRef}
                />
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="btn btn-xs btn-primary"
                  disabled={isThumbnailUploading}
                >
                  {isThumbnailUploading ? 'Uploading...' : 'Add Thumbnail'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Video Upload Section */}
        <div className="form-control mt-2">
          <label className="label text-sm text-secondary">Upload video</label>
          <input
            type="file"
            accept="video/*"
            className="file-input file-input-bordered file-input-sm file-input-primary w-full max-w-xs"
            onChange={(e) => handleFileUpload(e, 'video')}
            ref={videoInputRef}
            disabled={isVideoUploading}
          />
          {isVideoUploading && (
            <span className="text-sm text-secondary mt-1">
              Uploading video, please wait...
            </span>
          )}
          {videoUrl && !isVideoUploading && (
            <span className="text-sm text-green-400 mt-1">
              Video ready for posting.
            </span>
          )}
        </div>
        {/* Scheduling Section */}
        <div className="form-control mt-2">
          <label className="label cursor-pointer w-52">
            <span className="text-secondary text-md">Schedule Upload</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
            />
          </label>
          {isScheduled && (
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="flex gap-2">
                <input
                  type="date"
                  value={ytPostObj.post_scheduled_date}
                  className="input input-bordered w-full max-w-xs "
                  onChange={(e) =>
                    updateFormValue('post_scheduled_date', e.target.value)
                  }
                />

                <input
                  type="time"
                  value={ytPostObj.post_scheduled_time}
                  className="input input-bordered w-full max-w-xs "
                  onChange={(e) =>
                    updateFormValue('post_scheduled_time', e.target.value)
                  }
                />
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={ytPostObj.post_scheduled_timezone}
                  onChange={(e) =>
                    updateFormValue('post_scheduled_timezone', e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select Timezone
                  </option>
                  {timezones.map((timezone) => (
                    <option key={timezone.id} value={timezone.tz}>
                      {timezone.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons & Error Display */}
        <div className="mt-auto pt-4">
          {/* NEW: Error message display */}
          {error && (
            <div className="text-red-500 text-sm mb-2 text-center w-full">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary px-6 w-full"
            onClick={handlePost}
            disabled={isPosting || isVideoUploading || isThumbnailUploading}
          >
            {isPosting ? 'Posting...' : 'Post Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

import DropDownInputBox from '@/components/input/dropDownInput';
import InputText from '@/components/input/input-text';
import TextArea from '@/components/input/text-area';
import Small_exit_icon from '@/svg/small_exit_icon';
import axios from 'axios';
import { title } from 'process';
import React, { useEffect, useRef, useState } from 'react';

export default function YtPostCreator() {
  const INITIAL_YT_POST_OBJ = {
    post_title: '',
    post_description: '',
    post_tags: '',
    post_category_id: '',
    created_at: Date.now(),
  };
  const [ytPostObj, setYtPostObj] = useState(INITIAL_YT_POST_OBJ);
  // const [channels, setChannels] = useState([]);
  // const [selectedChannel, setSelectedChannel] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const updateFormValue = (updateType: string, value: string) => {
    setYtPostObj({ ...ytPostObj, [updateType]: value });
  };
  const imageInputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   axios
  //     .get('http://localhost:5000/youtube/list-channels', {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       setChannels(res.data.map((channel: any) => channel.channel_title));
  //     });
  // }, []);

  const handlePost = async () => {
    const response = await axios
      .post('http://localhost:5000/youtube/upload/video', {
        title: ytPostObj.post_title,
        description: ytPostObj.post_description,
        tags: ytPostObj.post_tags,
        categoryId: ytPostObj.post_category_id,
        s3VideoUrl: videoUrl,
        s3ThumbnailUrl: thumbnailUrl,
        privacyStatus: 'public',
      })
      .catch((err) => console.log(err));
    console.log(response);
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    // Add loading state
    setIsLoading(true);

    try {
      // Prepare file data for pre-signed URL request
      const fileData = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      };

      // Get pre-signed URL from the backend
      const response = await axios.post(
        `http://localhost:5000/youtube/s3ThumbnailUrl`,
        {
          file: fileData,
        }
      );

      const { url, key } = response.data;

      // Upload file to S3 using the pre-signed URL
      await axios.put(url, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      // Construct the final URL of the uploaded video
      const newThumbnailUrl = `https://intrend-images.s3.ap-south-1.amazonaws.com/${key}`;

      setThumbnailUrl(newThumbnailUrl);

      alert('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      // Remove loading state
      setIsLoading(false);
    }
  };

  const handleVideoInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    // Add loading state
    setIsLoading(true);

    try {
      // Prepare file data for pre-signed URL request
      const fileData = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      };

      // Get pre-signed URL from the backend
      const response = await axios.post(
        `http://localhost:5000/youtube/s3VideoUrl`,
        {
          file: fileData,
        }
      );

      const { url, key } = response.data;

      // Upload file to S3 using the pre-signed URL
      await axios.put(url, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      // Construct the final URL of the uploaded video
      const newVideoUrl = `https://intrend-images.s3.ap-south-1.amazonaws.com/${key}`;

      setVideoUrl(newVideoUrl);

      alert('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      // Remove loading state
      setIsLoading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/delete-s3-images',
        {
          keys: [getImageKey(imageUrl)],
        }
      );
      console.log(response.data.message);
      setThumbnailUrl('');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const getImageKey = (imageUrl: string) => {
    // Extract the key from the URL (assuming standard S3 URL format)
    return imageUrl.split('.amazonaws.com/')[1];
  };

  // const dropdownOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value, checked } = e.target;
  //   const selections = selectedChannel;

  //   if (checked) {
  //     setSelectedChannel([...selections, value]);
  //   } else {
  //     setSelectedChannel(selectedChannel.filter((e) => e !== value));
  //   }
  // };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="overflow-y-auto overscroll-contain px-8 pb-24">
        {/* <DropDownInputBox
          placeholder="Select Pages"
          label="Pages"
          value={selectedChannel}
          list={channels}
          onChange={dropdownOnChange}
        /> */}
        <InputText
          type="text"
          defaultValue={ytPostObj.post_title}
          updateType="post_title"
          containerStyle="mt-2"
          labelTitle="Post title"
          placeholder="Enter Post title"
          updateFormValue={updateFormValue}
        />
        {/* <InputText
          type="text"
          defaultValue=""
          updateType="post_tags"
          containerStyle="mt-2"
          labelTitle="Post tags"
          placeholder="Enter Post tags"
          updateFormValue={updateFormValue}
        /> */}
        <InputText
          type="text"
          defaultValue={ytPostObj.post_category_id}
          updateType="post_category_id"
          containerStyle="mt-2"
          labelTitle="Post Category Id"
          placeholder="Enter Post Category Id"
          updateFormValue={updateFormValue}
        />

        <div className="form-control">
          <label className="label text-sm text-white pt-4">Description</label>

          <div className="border border-gray-500 text-white  rounded-lg  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 block w-full p-2">
            <textarea
              placeholder="Type your content ..."
              className="h-32 mt-2 w-full text-sm text-white resize-none border-none bg-transparent focus:outline-none"
              onChange={(e) =>
                updateFormValue('post_description', e.target.value)
              }
              required
            />
            <div>
              <div className="flex gap-2">
                {thumbnailUrl && (
                  <div className="relative w-28 h-28 bg-neutral-700 rounded-lg">
                    <div
                      className="w-5 h-5 rounded-full bg-gray-500 absolute right-0 top-0"
                      onClick={() => handleRemoveImage(thumbnailUrl)}
                    >
                      <Small_exit_icon />
                    </div>
                    <img
                      className="w-full h-full object-contain rounded-lg"
                      src={thumbnailUrl}
                      alt=""
                    />
                  </div>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileInputChange}
              ref={imageInputRef}
            />
            <div className="flex gap-6">
              <button
                onClick={() => {
                  if (imageInputRef.current) {
                    imageInputRef.current.click();
                  }
                }}
                className="btn btn-xs btn-primary"
              >
                Add Thumbnail
              </button>
            </div>
          </div>
        </div>
        <div className="form-control ">
          <label className="label text-sm text-white pt-4">Upload video</label>
          <input
            type="file"
            className="file-input file-input-bordered file-input-sm file-input-primary w-full max-w-xs"
            onChange={handleVideoInput}
          />
          {isLoading && 'Uploading...'}
        </div>
        <div className="modal-action">
          <button className="btn btn-primary px-6" onClick={handlePost}>
            Post
          </button>
        </div>
      </div>

      <div className="bg-white"></div>
    </div>
  );
}

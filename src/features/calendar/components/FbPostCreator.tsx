import DropDownInputBox from '@/components/input/dropDownInput';
import InputText from '@/components/input/input-text';
import React, { useEffect, useRef, useState } from 'react';
import Comment from '../../../svg/comment';
import Like from '../../../svg/like';
import Share from '../../../svg/share';
import Photo from '../../../svg/photo';
import Emoji from '../../../svg/emoji';
import Small_exit_icon from '../../../svg/small_exit_icon';
import axios from 'axios';

export default function FbPostCreator() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [pageList, setPageList] = useState([]);
  const [pagesSelected, setPagesSelected] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [content, setContent] = useState('');

  const dropdownOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const selections = pagesSelected;

    if (checked) {
      setPagesSelected([...selections, value]);
    } else {
      setPagesSelected(pagesSelected.filter((e) => e !== value));
    }
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/list-pages', {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setPageList(response.data.map((page: any) => page.name));
      });
  }, []);

  const handlePost = async () => {
    await axios
      .post('http://localhost:5000/create-post', {
        page_names: pagesSelected,
        message: content,
        img_urls: imageUrls,
      })
      .catch((err) => console.log(err));
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) {
      return;
    }

    try {
      // Prepare file data for pre-signed URL request
      const filesData = Array.from(selectedFiles).map((file) => ({
        fileName: file.name,
        fileType: file.type,
      }));

      // Get pre-signed URLs from the backend
      const response = await axios.post('http://localhost:5000/s3Urls', {
        files: filesData,
      });

      const { urls } = response.data;

      // Upload files to S3 using the pre-signed URLs
      const uploadPromises = urls.map(async (urlObj: any, index: number) => {
        return axios
          .put(urlObj.url, selectedFiles[index], {
            headers: {
              'Content-Type': selectedFiles[index].type,
            },
          })
          .then(() => urlObj.key);
      });

      const uploadedKeys = await Promise.all(uploadPromises);

      // Construct the final URLs of the uploaded images
      const newImageUrls = uploadedKeys.map(
        (key) => `https://intrend-images.s3.ap-south-1.amazonaws.com/${key}`
      );

      setImageUrls((prevImageUrls) => [...prevImageUrls, ...newImageUrls]);

      alert('Files uploaded successfully');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
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
      setImageUrls((prevImageUrls) =>
        prevImageUrls.filter((url) => url !== imageUrl)
      );
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const getImageKey = (imageUrl: string) => {
    // Extract the key from the URL (assuming standard S3 URL format)
    return imageUrl.split('.amazonaws.com/')[1];
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="overflow-y-auto overscroll-contain px-8 pb-24">
        <DropDownInputBox
          placeholder="Select Pages"
          label="Pages"
          value={pagesSelected}
          onChange={dropdownOnChange}
          list={pageList}
        />
        <div className="form-control">
          <label className="block mb-2 text-xs font-normal text-white pt-4 ">
            Content
          </label>
          <div className="border border-gray-500 text-white  rounded-lg  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 block w-full p-2">
            <textarea
              placeholder="Type your content ..."
              className="h-32 mt-2 w-full text-sm text-white resize-none border-none bg-transparent focus:outline-none"
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div>
              <div className="flex gap-2">
                {imageUrls.map((imgUrl, i) => (
                  <div
                    className="relative w-28 h-28 bg-neutral-700 rounded-lg"
                    key={i}
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-gray-500 absolute right-0 top-0"
                      onClick={() => handleRemoveImage(imgUrl)}
                    >
                      <Small_exit_icon />
                    </div>
                    <img
                      className="w-full h-full object-contain rounded-lg"
                      src={imgUrl}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              multiple
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
              >
                <Photo color="#77A7FF" />
              </button>
              <button>
                <Emoji />
              </button>
            </div>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-primary px-6" onClick={handlePost}>
            Post
          </button>
        </div>
      </div>

      <div className="bg-gray-800">
        <div className="p-6">
          <div>
            <div className="bg-white rounded-md mb-4 m-16 p-2">
              <div className="flex items-center px-4 py-2">
                <div className="mr-2">
                  <img
                    src="https://picsum.photos/seed/picsum/200/200"
                    alt="Profile picture"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <h5 className="text-sm font-medium">test</h5>
                  <p className="text-xs text-gray-500">Just Now</p>
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-gray-700">
                  {'Your content will appear here'}
                </p>
              </div>
              <div className="flex justify-between px-12 py-2 border-t border-gray-200 text-sm font-medium">
                <div className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 gap-1">
                  <Like />
                  Like
                </div>
                <div className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 gap-1">
                  <Comment />
                  Comment
                </div>
                <div className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 gap-1">
                  <Share />
                  Share
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { openModal } from '@/features/common/modalSlice';
import { MODAL_BODY_TYPES } from '@/helper/app-constants';
import { useAppDispatch } from '@/lib/hooks';
import React from 'react';

export default function PostTypeConfirmation() {
  const dispatch = useAppDispatch();
  const openFbPostModal = () => {
    dispatch(
      openModal({
        title: 'Facebook Post',
        bodyType: MODAL_BODY_TYPES.FB_POST_CREATOR,
        fullScreen: true,
      })
    );
  };
  const openYtPostModal = () => {
    dispatch(
      openModal({
        title: 'Youtube Post',
        bodyType: MODAL_BODY_TYPES.YT_POST_CREATOR,
        fullScreen: true,
      })
    );
  };
  const openEmailModal = () => {
    dispatch(
      openModal({
        title: 'Email',
        bodyType: MODAL_BODY_TYPES.EMAIL_CREATOR,
        fullScreen: true,
      })
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        className="btn btn-md normal-case btn-primary"
        onClick={openFbPostModal}
      >
        facebook
      </button>
      <button
        className="btn btn-md normal-case btn-primary"
        onClick={openYtPostModal}
      >
        youtube
      </button>
      <button className="btn btn-md normal-case btn-primary">instagram</button>
      <button
        className="btn btn-md normal-case btn-primary"
        onClick={openEmailModal}
      >
        Email
      </button>
    </div>
  );
}

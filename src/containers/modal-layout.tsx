import { closeModal } from '../features/common/modalSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { MODAL_BODY_TYPES } from '@/helper/app-constants';
import ConfirmationModalBody from './confirmation-modal-body';
import PostTypeConfirmation from '@/features/calendar/components/PostTypeConfirmation';
import FbPostCreator from '@/features/calendar/components/FbPostCreator';
import YtPostCreator from '@/features/calendar/components/YtPostCreator';
import EmailCreator from '@/features/calendar/components/EmailCreator';

function ModalLayout() {
  const { isOpen, bodyType, size, fullScreen, extraObject, title } =
    useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(closeModal());
  };

  return (
    <>
      {/* The button to open modal */}

      {/* Put this part before </body> tag */}
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div
          className={`${
            fullScreen ? 'bg-base-100 w-full h-full' : 'modal-box'
          } ${size === 'lg' ? 'max-w-5xl' : ''}`}
        >
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => close()}
          >
            ✕
          </button>
          <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>

          {/* Loading modal body according to different modal type */}
          {
            {
              [MODAL_BODY_TYPES.POST_TYPE_CONFIRMATION]: (
                <PostTypeConfirmation />
              ),
              [MODAL_BODY_TYPES.FB_POST_CREATOR]: <FbPostCreator />,
              [MODAL_BODY_TYPES.YT_POST_CREATOR]: <YtPostCreator />,
              [MODAL_BODY_TYPES.EMAIL_CREATOR]: <EmailCreator />,
              [MODAL_BODY_TYPES.CONFIRMATION]: (
                <ConfirmationModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),
              [MODAL_BODY_TYPES.DEFAULT]: <div></div>,
            }[bodyType]
          }
        </div>
      </div>
    </>
  );
}

export default ModalLayout;

import { CONFIRMATION_MODAL_CLOSE_TYPES } from '@/helper/app-constants';
import { useAppDispatch } from '@/lib/hooks';

interface Props {
  extraObject?: any;
  closeModal: () => void;
}

function ConfirmationModalBody({ extraObject, closeModal }: Props) {
  const dispatch = useAppDispatch();

  const { message, type, index } = extraObject;

  const proceedWithYes = async () => {
    closeModal();
  };

  return (
    <>
      <p className="text-xl mt-8 text-center">{message}</p>

      <div className="modal-action mt-12">
        <button className="btn btn-outline" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary w-36"
          onClick={() => proceedWithYes()}
        >
          Yes
        </button>
      </div>
    </>
  );
}

export default ConfirmationModalBody;

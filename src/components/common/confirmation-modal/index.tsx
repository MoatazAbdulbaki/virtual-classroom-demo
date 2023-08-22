import { RefObject } from "react";
import { AtomLoader } from "../index";

interface Props {
  label?: string;
  confirmOption?: string;
  denyOption?: string;
  loading?: boolean;
  dialogRef: RefObject<HTMLDialogElement>;
  handleConfirmation: (confirmed: boolean) => void;
}

export const ConfirmationModal: React.FC<Props> = ({
  dialogRef,
  handleConfirmation,
  loading,
  label = "Are you sure?",
  confirmOption = "Confirm",
  denyOption = "Deny",
}) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <form method="dialog" className="modal-box">
        <button className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2">
          ✕
        </button>
        <div className="flex w-full flex-col flex-wrap items-center justify-between gap-5 py-10">
          <h4 className="text-xl">{label}</h4>
          <div className="flex w-full items-center justify-end gap-2">
            <button
              className="btn-primary btn-sm btn w-fit text-xs"
              onClick={() => handleConfirmation(false)}
              disabled={loading}
            >
              {denyOption}
            </button>
            <button
              className="btn-primary btn-sm btn w-fit bg-red-600 text-xs hover:bg-red-700"
              onClick={() => handleConfirmation(true)}
              disabled={loading}
            >
              {loading ? (
                <AtomLoader width="25px" height="25px" />
              ) : (
                confirmOption
              )}
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
};

export default ConfirmationModal;

import "./ConfirmationModal.css";
import { IoIosClose } from "react-icons/io";

export default function ConfirmationModal({
  title,
  message,
  actionMessage,
  primaryButtonLabel,
  showModal,
  isButtonRed = false,
  onClose,
  onConfirm,
}) {
  return (
    <div className={`cancel-modal-container ${showModal ? "show-modal" : ""}`}>
      <div className={`modal ${showModal ? "show-modal" : ""}`}>
        <div className="modal-close">
          <IoIosClose color="#212A4A" size={"3em"} onClick={onClose} />
        </div>
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        <div className="modal-content">
          <p>{message}</p>
          <p>{actionMessage}</p>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={isButtonRed ? "btn-delete" : "btn-normal"}
            onClick={onConfirm}
          >
            {primaryButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

import "./CancelModal.css";
import { IoIosClose } from "react-icons/io";

export default function CancelModal({ onClose, onConfirm }) {
  return (
    <div className="cancel-modal-container">
      <div className="modal">
        <div className="modal-close">
          <IoIosClose color="#212A4A" size={"3em"} onClick={onClose} />
        </div>
        <div className="modal-header">
          <h2>Delete Incubator? </h2>
        </div>
        <div className="modal-content">
          <p>
            Deleting this incubator will permanently remove it from your
            collection. This action cannot be undone.
          </p>
          <p>
            Are you sure you want to
            <span style={{ color: "red" }}> permanently delete</span> the
            incubation?
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-delete" onClick={onConfirm}>
            Delete Incubator
          </button>
        </div>
      </div>
    </div>
  );
}

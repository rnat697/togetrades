import styles from "./ConfirmationModal.module.css";
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
    <div
      className={`${styles["cancel-modal-container"]} ${
        showModal ? styles["show-modal"] : styles[""]
      }`}
    >
      <div
        className={`${styles["modal"]} ${
          showModal ? styles["show-modal"] : ""
        }`}
      >
        <div className={styles["modal-close"]}>
          <IoIosClose color="#212A4A" size={"3em"} onClick={onClose} />
        </div>
        <div className={styles["modal-header"]}>
          <h2>{title}</h2>
        </div>
        <div className={styles["modal-content"]}>
          <p>{message}</p>
          <p>{actionMessage}</p>
        </div>
        <div className={styles["modal-footer"]}>
          <button className={styles["btn-cancel"]} onClick={onClose}>
            Cancel
          </button>
          <button
            className={
              isButtonRed ? styles["btn-delete"] : styles["btn-normal"]
            }
            onClick={onConfirm}
          >
            {primaryButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

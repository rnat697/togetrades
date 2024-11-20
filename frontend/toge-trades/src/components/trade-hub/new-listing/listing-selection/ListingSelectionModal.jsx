import { Tooltip } from "react-tooltip";
import styles from "./ListingSelectionModal.module.css";
import { IoIosClose, IoIosInformationCircle } from "react-icons/io";
export default function ListingSelectionModal({
  showModal,
  isOffered,
  onConfirm,
  onClose,
}) {
  const tooltipMessages = [
    "Offerable Pokémon: unlocked, not traded before, and not in active trades.",
    "Sought Pokémon: from your wishlist.",
  ];

  return (
    <div
      className={`${styles["selection-modal-container"]} ${
        showModal ? styles["show-modal"] : ""
      }`}
    >
      <div
        className={`${styles["modal"]} ${
          showModal ? styles["show-modal"] : ""
        }`}
      >
        <div className="modal-close">
          <IoIosClose color="#212A4A" size={"3em"} onClick={onClose} />
        </div>
        <div className={styles["selection-modal-title"]}>
          <h2>{`Select a Pokemon to ${isOffered ? "offer" : "seek"}`}</h2>
          <a
            data-tooltip-id="selection-modal-tooltips"
            data-tooltip-content={
              isOffered ? tooltipMessages[0] : tooltipMessages[1]
            }
          >
            <IoIosInformationCircle size={23} />
          </a>
        </div>
        <div className={styles["selection-modal-pokemon"]}></div>
        <div className={styles["selection-modal-button"]}>
          <button onClick={() => onConfirm()}>{`Add ${
            isOffered ? "Offering" : "Seeking"
          }`}</button>
        </div>
        <Tooltip id="selection-modal-tooltips" />
      </div>
    </div>
  );
}

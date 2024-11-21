import { Tooltip } from "react-tooltip";
import styles from "./ListingSelectionModal.module.css";
import { IoIosClose, IoIosInformationCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../api/auth";
import { getAllWishlist } from "../../../../controllers/PokedexController";
import InfiniteScroll from "../infinite-scroll/InfiniteScroll";
export default function ListingSelectionModal({
  showModal,
  isOffered = false,
  onConfirm,
  onClose,
}) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const tooltipMessages = [
    "Offerable Pokémon: unlocked, not traded before, and not in active trades.",
    "Sought Pokémon: from your wishlist.",
  ];

  // --- GET requests for selections ---
  useEffect(() => {
    if (showModal) {
      if (isOffered) {
        // get request for pokemons
      } else {
        // get request for wishlisted species
        getAllWishlist(user._id).then((data) => {
          setItems(data);
        });
      }
    }
  }, [showModal, isOffered]);

  // Selected item from the infinite scroll / pagination thingies
  const handleSelectedItemChange = (item) => {
    console.log(item);
    setSelectedItem(item);
  };

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
        {isOffered ? (
          <div className={styles["selection-modal-poke-pagination"]}></div>
        ) : (
          <div className={styles["selection-modal-infnite-scroll"]}>
            <InfiniteScroll
              items={items}
              onItemSelect={handleSelectedItemChange}
            />
          </div>
        )}
        <div className={styles["selection-modal-button"]}>
          <button onClick={() => onConfirm(selectedItem)}>{`Add ${
            isOffered ? "Offering" : "Seeking"
          }`}</button>
        </div>
        <Tooltip id="selection-modal-tooltips" />
      </div>
    </div>
  );
}

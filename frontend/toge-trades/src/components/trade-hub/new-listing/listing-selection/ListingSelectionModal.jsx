import { Tooltip } from "react-tooltip";
import styles from "./ListingSelectionModal.module.css";
import { IoIosClose, IoIosInformationCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../api/auth";
import { getAllWishlist } from "../../../../controllers/PokedexController";
import InfiniteScroll from "../infinite-scroll/InfiniteScroll";
import getEligibleTradePokemon from "../../../../controllers/ListingsController";
import ReactPaginate from "react-paginate";
import { capitalizeFirstLetter } from "../../../utils/utils";
export default function ListingSelectionModal({
  showModal,
  isOffered = false,
  onConfirm,
  onClose,
}) {
  const { user } = useAuth();
  const [pokemon, setPokemon] = useState([]);
  const [species, setSpecies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState({});
  const tooltipMessages = [
    "Offerable Pokémon: unlocked, not traded before, and not in active trades.",
    "Sought Pokémon: from your wishlist.",
  ];

  // --- GET requests for selections ---
  useEffect(() => {
    if (showModal) {
      if (isOffered) {
        // get request for pokemons
        getEligibleTradePokemon(1).then((data) => {
          setMetadata(data.metadata);
          setPokemon(data.pokemon);
        });
      } else {
        // get request for wishlisted species
        getAllWishlist(user._id).then((data) => {
          setSpecies(data);
        });
      }
    }
  }, [showModal, isOffered]);

  useEffect(() => {
    if (isOffered) {
      // get request for pokemons
      getEligibleTradePokemon(currentPage).then((data) => {
        setMetadata(data.metadata);
        setPokemon(data.pokemon);
      });
    }
  }, [currentPage]);

  // Selected item from the infinite scroll / pagination thingies
  const handleSelectedItemChange = (item) => {
    setSelectedItem(item);
  };

  // for pagination
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
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
          <IoIosClose
            color="#212A4A"
            size={"3em"}
            onClick={() => {
              setCurrentPage(1);
              return onClose();
            }}
          />
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
          <div className={styles["selection-modal-poke-pagination"]}>
            {pokemon.map((poke, index) => (
              <a
                data-tooltip-id="selection-modal-tooltips"
                data-tooltip-content={`${
                  poke.isShiny ? "Shiny" : ""
                } ${capitalizeFirstLetter(poke.species.name)}`}
                key={`${index}-${poke.species.name}`}
              >
                <div
                  className={`${styles["pagination-item"]} ${
                    selectedItem === poke ? styles.selected : ""
                  }`}
                  key={`${index}-${poke.id}`}
                  onClick={() => handleSelectedItemChange(poke)}
                >
                  <img
                    src={
                      poke.isShiny
                        ? poke.species.image.shiny
                        : poke.species.image.normal
                    }
                  />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className={styles["selection-modal-infnite-scroll"]}>
            <InfiniteScroll
              items={species}
              onItemSelect={handleSelectedItemChange}
            />
          </div>
        )}
        {isOffered ? (
          <div className={styles["listing-selection-paginate"]}>
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              pageCount={metadata?.totalPages ?? 1}
              previousLabel="<"
              renderOnZeroPageCount={null}
              containerClassName={styles["pagination"]}
              activeClassName={styles["pagination-active"]}
              pageClassName={styles["page-item"]}
              previousClassName={styles["page-item"]}
              nextClassName={styles["page-item"]}
              breakClassName={styles["page-item"]}
            />
          </div>
        ) : null}
        <div className={styles["selection-modal-button"]}>
          <button
            onClick={() => {
              setCurrentPage(1);
              return onConfirm(selectedItem);
            }}
          >
            {`Add ${isOffered ? "Offering" : "Seeking"}`}
          </button>
        </div>
        <Tooltip id="selection-modal-tooltips" />
      </div>
    </div>
  );
}

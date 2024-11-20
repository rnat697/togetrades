import styles from "./ListingBox.module.css";
import { IoIosInformationCircle } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

export default function ListingBox({
  title,
  tooltipMsg,
  onClicked,
  isOffering = false,
  pokemon,
}) {
  return (
    <div
      className={`${styles["listing-box-container"]} ${
        isOffering ? "" : styles["seeking"]
      }`}
    >
      <div className={styles["listing-box-content"]}>
        <div className={styles["listing-box-title"]}>
          <p>{title}</p>
          <a
            data-tooltip-id="listing-box-tooltips"
            data-tooltip-content={tooltipMsg}
          >
            <IoIosInformationCircle size={22} />
          </a>
        </div>
        <div
          className={styles["listing-box-add"]}
          onClick={() => onClicked(isOffering)}
        >
          {pokemon ? (
            <img
              src={
                pokemon.isShiny
                  ? pokemon.species.image.shiny
                  : pokemon.species.image.normal
              }
            />
          ) : (
            <FaPlus size={50} />
          )}
        </div>
      </div>
      <Tooltip id="listing-box-tooltips" />
    </div>
  );
}

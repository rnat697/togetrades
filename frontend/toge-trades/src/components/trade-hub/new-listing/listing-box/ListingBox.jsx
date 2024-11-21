import styles from "./ListingBox.module.css";
import { IoIosInformationCircle } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";

export default function ListingBox({
  title,
  tooltipMsg,
  onClicked,
  isOffering = false,
  pokemon = null,
  isSpecies = false,
  isShinyWanted = false,
}) {
  const [image, setImage] = useState(null);
  const [isShiny, setShiny] = useState(false);
  useEffect(() => {
    if (pokemon) {
      setImage(isSpecies ? pokemon.image : pokemon.species.image);
      if (!isSpecies) {
        setShiny(pokemon.isShiny);
      } else {
        setShiny(isShinyWanted);
      }
    } else {
      setImage(null);
    }
  }, [pokemon]);

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
          {image ? (
            <img
              className={styles["pokemon-img"]}
              src={isShiny ? image.shiny : image.normal}
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

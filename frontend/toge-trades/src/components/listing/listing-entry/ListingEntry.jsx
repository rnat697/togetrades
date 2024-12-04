import { capitalizeFirstLetter } from "../../utils/utils";
import styles from "./ListingEntry.module.css";
import { FaCheck } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";

export default function ListingEntry({
  pokemon,
  isSpecies = false,
  isShiny = false,
  isOwned,
}) {
  const image = isSpecies ? pokemon.image : pokemon.species.image;
  const name = isSpecies ? pokemon.name : pokemon.species.name;
  const isLegendary = isSpecies
    ? pokemon.isLegendary
    : pokemon.species.isLegendary;
  return (
    <div className={styles["listing-entry-container"]}>
      <div
        className={`${styles["listing-poke-img"]} ${
          isSpecies ? styles["seeking"] : ""
        }`}
      >
        <img src={isShiny ? image.shiny : image.normal} />
        <p>{capitalizeFirstLetter(name)}</p>
      </div>
      <div className={styles["listing-table"]}>
        <table>
          <thead>
            <tr>
              <th>Is it a shiny?</th>
              <th>Is it a legendary?</th>
              <th>Do I have it already?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {isShiny ? <FaCheck size={40} /> : <IoIosClose size={70} />}
              </td>
              <td>
                {isLegendary ? <FaCheck size={40} /> : <IoIosClose size={70} />}
              </td>
              <td>
                {isOwned ? <FaCheck size={40} /> : <IoIosClose size={70} />}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

import "./PokeBoxCards.css";
import FavoriteButton from "../../favourite/FavoriteButton";
import TradeableButton from "../../tradeable/TradeableButton";
import { capitalizeFirstLetter } from "../../utils/utils";

import { BsStars } from "react-icons/bs";

export default function PokeBoxCards({ pokemon }) {
  console.log(pokemon);
  return (
    <div className="cards-container">
      <div className="rare-indicator">
        <img
          className={`${pokemon.species.isLegendary ? "show-legendary" : ""}`}
          src="../../../src/assets/legendary-icon.png"
        />
        <BsStars
          className={`shiny-star ${pokemon.isShiny ? "show-shiny" : ""}`}
        />
      </div>
      <div className="pokemon">
        <img
          src={
            pokemon.isShiny
              ? pokemon.species.image.shiny
              : pokemon.species.image.normal
          }
        />
        <p>{capitalizeFirstLetter(pokemon.species.name)}</p>
      </div>
      <div className="pokebox-buttons">
        <FavoriteButton />
        <TradeableButton />
      </div>
    </div>
  );
}

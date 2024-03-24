import "./PokeBoxCards.css";
import FavoriteButton from "../../favourite/FavoriteButton";
import TradeableButton from "../../tradeable/TradeableButton";

import { BsStars } from "react-icons/bs";

export default function PokeBoxCards({ pokemon }) {
  const isShiny = true;
  const isLegendary = true;
  return (
    <div className="cards-container">
      <div className="rare-indicator">
        <img
          className={`${isLegendary ? "show-legendary" : ""}`}
          src="../../../src/assets/legendary-icon.png"
        />
        <BsStars className={`shiny-star ${isShiny ? "show-shiny" : ""}`} />
      </div>
      <div className="pokemon">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png" />
        <p>Ditto</p>
      </div>
      <div className="pokebox-buttons">
        <FavoriteButton />
        <TradeableButton />
      </div>
    </div>
  );
}

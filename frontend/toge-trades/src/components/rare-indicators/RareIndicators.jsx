import "./RareIndicators.css";
import { BsStars } from "react-icons/bs";

export default function RareIndicators({ pokemon }) {
  return (
    <div className="rare-indicator">
      <img
        className={`${pokemon.species.isLegendary ? "show-legendary" : ""}`}
        src="../../../src/assets/legendary-icon.png"
      />
      <BsStars
        className={`shiny-star ${pokemon.isShiny ? "show-shiny" : ""}`}
      />
    </div>
  );
}

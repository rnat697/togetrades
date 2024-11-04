import "./RareIndicators.css";
import { BsStars } from "react-icons/bs";
import { Tooltip } from "react-tooltip";

export default function RareIndicators({ pokemon }) {
  return (
    <div className="rare-indicator">
      <a
        data-tooltip-id="rare-indicator-tooltips"
        data-tooltip-content="Legendary Pokemon"
      >
        <img
          className={`${pokemon.species.isLegendary ? "show-legendary" : ""}`}
          src="../../../src/assets/legendary-icon.png"
        />
      </a>
      <a
        data-tooltip-id="rare-indicator-tooltips"
        data-tooltip-content="Shiny Pokemon"
      >
        <BsStars
          className={`shiny-star ${pokemon.isShiny ? "show-shiny" : ""}`}
        />
      </a>
      <Tooltip id="rare-indicator-tooltips" />
    </div>
  );
}

import "./PokeBoxCards.css";
import LockButton from "../../lock/LockButton";
import TradingIcon from "../../trading/TradingIcon";
import { capitalizeFirstLetter } from "../../utils/utils";
import RareIndicators from "../../rare-indicators/RareIndicators";
import { Tooltip } from "react-tooltip";

export default function PokeBoxCards({ pokemon, onClick }) {
  return (
    <div className="cards-container">
      <div onClick={onClick}>
        <RareIndicators pokemon={pokemon} />
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
      </div>
      <div className="pokebox-buttons">
        <a
          data-tooltip-id="locked-n-trade"
          data-tooltip-content={`${pokemon.isLocked ? "Unlock" : "Lock"} to ${
            pokemon.isLocked ? "enable" : "disable"
          } trading.`}
        >
          <LockButton pokemonId={pokemon.id} isPokeLocked={pokemon.isLocked} />
        </a>
        <a
          data-tooltip-id="locked-n-trade"
          data-tooltip-content={`${
            pokemon.isTrading ? "In" : "Not in"
          } an active trade offer.`}
        >
          <TradingIcon isPokeTrading={pokemon.isTrading} />
        </a>
        <Tooltip id="locked-n-trade" />
      </div>
    </div>
  );
}

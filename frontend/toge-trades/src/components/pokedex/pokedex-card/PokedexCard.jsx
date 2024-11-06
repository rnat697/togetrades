import { useNavigate } from "react-router-dom";
import PokemonType from "../../pokemon-type/PokemonType";
import { capitalizeFirstLetter, formatDexNumber } from "../../utils/utils";
import "./PokedexCard.css";
import { Tooltip } from "react-tooltip";

export default function PokedexCard({ species }) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`/pokedex/entry/${species.dexNumber}`);
    console.log(`clicked - ${species.id}`);
    console.log(`clicked - ${species.name}`);
  };
  return (
    <div className="dex-card-container" onClick={handleOnClick}>
      <div className="dex-card-contents">
        <div className="dex-num">
          <p>{formatDexNumber(species.dexNumber)}</p>
        </div>
        <a
          data-tooltip-id="pokedex-tooltips"
          data-tooltip-content={`You ${
            species.isMissing ? "don't own" : "own"
          } ${capitalizeFirstLetter(species.name)}`}
        >
          <img
            className={`species-img ${species.isMissing ? "missing" : ""}`}
            src={species.image.normal}
          />
        </a>
        <p>{capitalizeFirstLetter(species.name)}</p>
        <Tooltip id="pokedex-tooltips" />
      </div>
    </div>
  );
}

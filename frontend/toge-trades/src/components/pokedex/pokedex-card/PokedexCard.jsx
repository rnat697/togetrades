import { useNavigate } from "react-router-dom";
import PokemonType from "../../pokemon-type/PokemonType";
import { capitalizeFirstLetter, formatDexNumber } from "../../utils/utils";
import "./PokedexCard.css";
import { Tooltip } from "react-tooltip";
import WishlistButton from "../../wishlist/WishlistButton";

export default function PokedexCard({ species, isWishlisted }) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`/pokedex/entry/${species.dexNumber}`);
  };
  return (
    <div className="dex-card-container">
      <div className="dex-card-contents" onClick={handleOnClick}>
        <div className="dex-num">
          <p>{formatDexNumber(species.dexNumber)}</p>
        </div>
        <a
          data-tooltip-id="pokedex-tooltips"
          data-tooltip-content={`You ${
            species.isMissing ? "don't own" : "own or haved owned"
          } ${capitalizeFirstLetter(species.name)}`}
        >
          <img
            className={`species-img ${species.isMissing ? "missing" : ""}`}
            src={species.image.normal}
          />
        </a>
        <p>{capitalizeFirstLetter(species.name)}</p>
      </div>
      <div className="dex-wish">
        <WishlistButton
          isMissing={species.isMissing}
          isWishlisted={isWishlisted}
        />
      </div>
      <Tooltip id="pokedex-tooltips" />
    </div>
  );
}

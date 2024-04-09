import "./PokemonType.css";
import { capitalizeFirstLetter, getTypeColorAndImage } from "../utils/utils";

export default function PokemonType({ type }) {
  const typeData = getTypeColorAndImage(type);

  return (
    <div className="type-container" style={{ backgroundColor: typeData.color }}>
      <img src={typeData.src} />
      <p>{capitalizeFirstLetter(type)}</p>
    </div>
  );
}

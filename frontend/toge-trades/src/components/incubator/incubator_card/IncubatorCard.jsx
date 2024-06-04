import "./IncubatorCard.css";
import eggIncubatorImg from "../../../assets/egg_incubator.png";
import { capitalizeFirstLetter, getTypeColorAndImage } from "../../utils/utils";

export default function IncubatorCard({ incubator }) {
  const typeColor = getTypeColorAndImage(incubator.pokemonType);

  return (
    <div
      className="incubator-card-container"
      style={{ backgroundColor: typeColor.lowOpacityColor }}
    >
      <div className="incubator-card-heading">
        <img src={eggIncubatorImg} />
        <div className="incubator-card-title">
          <h2>{`${capitalizeFirstLetter(incubator.pokemonType)} Type Egg`}</h2>
          <p>{incubator.hatchTime}</p>
        </div>
      </div>
      <div className="incubator-buttons">
        <button className="hatch-btn">Hatch</button>
        <button className="incubator-outline-btn">Cancel</button>
      </div>
    </div>
  );
}

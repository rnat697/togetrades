import "./IncubatorCard.css";
import eggIncubatorImg from "../../../assets/egg_incubator.png";
import { capitalizeFirstLetter, getTypeColorAndImage } from "../../utils/utils";
import Countdown from "../../countdown/Countdown";
import { useState } from "react";

export default function IncubatorCard({
  incubator,
  onHatchClick,
  onCancelClick,
}) {
  const typeColor = getTypeColorAndImage(incubator.pokemonType);
  const [countdownComplete, setCountdownComplete] = useState(false);
  const handleCountdownComplete = (isDone) => {
    setCountdownComplete(isDone);
  };

  return (
    <div
      className="incubator-card-container"
      style={{ backgroundColor: typeColor.lowOpacityColor }}
    >
      <div className="incubator-card-heading">
        <img src={eggIncubatorImg} />
        <div className="incubator-card-title">
          <h2>{`${capitalizeFirstLetter(incubator.pokemonType)} Type Egg`}</h2>
          <Countdown
            deadline={incubator.hatchTime}
            onCountdownComplete={handleCountdownComplete}
          />
        </div>
      </div>
      <div className="incubator-buttons">
        <button
          data-testid={`${incubator._id}-hatch-btn`}
          className="hatch-btn"
          disabled={!countdownComplete}
          onClick={onHatchClick}
        >
          Hatch
        </button>
        <button
          data-testid={`${incubator._id}-cancel-btn`}
          className="incubator-outline-btn"
          onClick={onCancelClick}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

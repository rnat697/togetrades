import "./EggPickerPage.css";
import {
  capitalizeFirstLetter,
  getTypeColorAndImage,
} from "../../components/utils/utils";
import { useState } from "react";
import { addNewIncubator } from "../../controllers/IncubatorController";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function EggPickerPage() {
  const [selectedType, setSelectedType] = useState("");
  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];
  const navigate = useNavigate();
  const handleTypeButtonClick = (type) => {
    // only one button can be selected at a given time
    // deselects type if user clicked on it again
    setSelectedType(type === selectedType ? "" : type);
  };
  const handleSubmitButtonClick = () => {
    addNewIncubator(selectedType, navigate);
  };

  return (
    <div className="egg-picker-container">
      <h1>Egg Picker</h1>
      <p>What type of egg do you want to incubate?</p>
      <div className="type-selection">
        {types.map((type) => {
          const colorImage = getTypeColorAndImage(type);
          return (
            <button
              data-testid={`${type}-btn`}
              key={type}
              style={{
                backgroundColor: colorImage.color,
                borderColor:
                  type === selectedType
                    ? colorImage.lowOpacityColor
                    : "transparent",
                borderWidth: "0.4em",
              }}
              onClick={() => handleTypeButtonClick(type)}
            >
              <img src={colorImage.src} alt={type} />
              {capitalizeFirstLetter(type)}
            </button>
          );
        })}
      </div>
      <button
        data-testid="start-incubation-btn"
        onClick={() => handleSubmitButtonClick()}
        disabled={!selectedType}
      >
        Start Incubating
      </button>
      <ToastContainer />
    </div>
  );
}

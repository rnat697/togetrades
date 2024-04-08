import bugImage from "../../assets/TypeBug.png";
import darkImage from "../../assets/TypeDark.png";
import dragonImage from "../../assets/TypeDragon.png";
import electricImage from "../../assets/TypeElectric.png";
import fairyImage from "../../assets/TypeFairy.png";
import fightingImage from "../../assets/TypeFighting.png";
import fireImage from "../../assets/TypeFire.png";
import flyingImage from "../../assets/TypeFlying.png";
import ghostImage from "../../assets/TypeGhost.png";
import grassImage from "../../assets/TypeGrass.png";
import groundImage from "../../assets/TypeGround.png";
import iceImage from "../../assets/TypeIce.png";
import normalImage from "../../assets/TypeNormal.png";
import poisonImage from "../../assets/TypePoison.png";
import psychicImage from "../../assets/TypePsychic.png";
import rockImage from "../../assets/TypeRock.png";
import steelImage from "../../assets/TypeSteel.png";
import waterImage from "../../assets/TypeWater.png";

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function objectToQueryString(obj) {
  const queryParams = [];
  for (const [key, value] of Object.entries(obj)) {
    queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }
  return queryParams.join("&");
}

export function getTypeColorAndImage(type) {
  const data = { src: "", color: "" };
  switch (type) {
    case "bug":
      data.src = bugImage;
      data.color = "#91A119";
      break;
    case "dark":
      data.src = darkImage;
      data.color = "#624D4E";
      break;
    case "dragon":
      data.src = dragonImage;
      data.color = "#5060E1";
      break;
    case "electric":
      data.src = electricImage;
      data.color = "#FAC000";
      break;
    case "fairy":
      data.src = fairyImage;
      data.color = "#EF70EF";
      break;
    case "fighting":
      data.src = fightingImage;
      data.color = "#FF8000";
      break;
    case "fire":
      data.src = fireImage;
      data.color = "#E62829";
      break;
    case "flying":
      data.src = flyingImage;
      data.color = "#81B9EF";
      break;
    case "ghost":
      data.src = ghostImage;
      data.color = "#704170";
      break;
    case "grass":
      data.src = grassImage;
      data.color = "#3FA129";
      break;
    case "ground":
      data.src = groundImage;
      data.color = "#915121";
      break;
    case "ice":
      data.src = iceImage;
      data.color = "#3DCEF3";
      break;
    case "normal":
      data.src = normalImage;
      data.color = "#9FA19F";
      break;
    case "poison":
      data.src = poisonImage;
      data.color = "#9141CB";
      break;
    case "psychic":
      data.src = psychicImage;
      data.color = "#EF4179";
      break;
    case "rock":
      data.src = rockImage;
      data.color = "#AFA981";
      break;
    case "steel":
      data.src = steelImage;
      data.color = "#60A1B8";
      break;
    case "water":
      data.src = waterImage;
      data.color = "#2980EF";
      break;

    default:
      data.src = "";
      data.color = "";
      break;
  }
  return data;
}

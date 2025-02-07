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

export function convertHectogramToKilogram(weight) {
  return weight / 10;
}

export function convertDecimeterToMeters(height) {
  return height / 10;
}

export function formatDexNumber(number) {
  let formatedDexNumber = "#" + number.toString().padStart(4, "0");
  return formatedDexNumber;
}

export function formatRelativeTime(date) {
  const now = new Date();
  const timeDiff = date - now;

  // Relative time format
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const seconds = 1000;
  const minutes = seconds * 60;
  const hours = minutes * 60;
  const days = hours * 24;
  const months = days * 30; // Approximate months
  const years = days * 365; // Approximate years

  if (Math.abs(timeDiff) < minutes) {
    return rtf.format(Math.floor(timeDiff / seconds), "seconds");
  } else if (Math.abs(timeDiff) < hours) {
    return rtf.format(Math.floor(timeDiff / minutes), "minutes");
  } else if (Math.abs(timeDiff) < days) {
    return rtf.format(Math.floor(timeDiff / hours), "hours");
  } else if (Math.abs(timeDiff) < months) {
    return rtf.format(Math.floor(timeDiff / days), "days");
  } else if (Math.abs(timeDiff) < years) {
    return rtf.format(Math.floor(timeDiff / months), "months");
  } else {
    return rtf.format(Math.floor(timeDiff / years), "years");
  }
}


export function getTypeColorAndImage(type) {
  const data = { src: "", color: "", lowOpacityColor: "" };
  switch (type) {
    case "bug":
      data.src = bugImage;
      data.color = "#91A119";
      data.lowOpacityColor = "#DEE3BA";
      break;
    case "dark":
      data.src = darkImage;
      data.color = "#624D4E";
      data.lowOpacityColor = "#D0CACA";
      break;
    case "dragon":
      data.src = dragonImage;
      data.color = "#5060E1";
      data.lowOpacityColor = "#CBCFF6";
      break;
    case "electric":
      data.src = electricImage;
      data.color = "#FAC000";
      data.lowOpacityColor = "#FEECB3";
      break;
    case "fairy":
      data.src = fairyImage;
      data.color = "#EF70EF";
      data.lowOpacityColor = "#FAD4FA";
      break;
    case "fighting":
      data.src = fightingImage;
      data.color = "#FF8000";
      data.lowOpacityColor = "#FFD9B3";
      break;
    case "fire":
      data.src = fireImage;
      data.color = "#E62829";
      data.lowOpacityColor = "#F8BFBF";
      break;
    case "flying":
      data.src = flyingImage;
      data.color = "#81B9EF";
      data.lowOpacityColor = "#D9EAFA";
      break;
    case "ghost":
      data.src = ghostImage;
      data.color = "#704170";
      data.lowOpacityColor = "#D4C6D4";
      break;
    case "grass":
      data.src = grassImage;
      data.color = "#3FA129";
      data.lowOpacityColor = "#C5E3BF";
      break;
    case "ground":
      data.src = groundImage;
      data.color = "#915121";
      data.lowOpacityColor = "#DECBBC";
      break;
    case "ice":
      data.src = iceImage;
      data.color = "#3DCEF3";
      data.lowOpacityColor = "#C5F0FB";
      break;
    case "normal":
      data.src = normalImage;
      data.color = "#9FA19F";
      data.lowOpacityColor = "#E2E3E2";
      break;
    case "poison":
      data.src = poisonImage;
      data.color = "#9141CB";
      data.lowOpacityColor = "#DEC6EF";
      break;
    case "psychic":
      data.src = psychicImage;
      data.color = "#EF4179";
      data.lowOpacityColor = "#FAC6D7";
      break;
    case "rock":
      data.src = rockImage;
      data.color = "#AFA981";
      data.lowOpacityColor = "#E7E5D9";
      break;
    case "steel":
      data.src = steelImage;
      data.color = "#60A1B8";
      data.lowOpacityColor = "#CFE3EA";
      break;
    case "water":
      data.src = waterImage;
      data.color = "#2980EF";
      data.lowOpacityColor = "#BFD9FA";
      break;

    default:
      data.src = "";
      data.color = "";
      break;
  }
  return data;
}

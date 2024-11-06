import { useNavigate, useParams } from "react-router-dom";
import "./PokedexNavigation.css";
import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { capitalizeFirstLetter, formatDexNumber } from "../../utils/utils";

export default function PokedexNavigation({
  metadata,
  isNext = false,
  onClick,
}) {
  return (
    <div className="entry-nav-container" onClick={() => onClick(metadata)}>
      <div className={`arrow ${isNext ? "next" : ""}`}>
        {isNext ? (
          <IoIosArrowForward size={"4em"} color="#616980" />
        ) : (
          <IoIosArrowBack size={"4em"} color="#616980" />
        )}
      </div>
      <div className="titles">
        <h2 className="entry-dex-num">{formatDexNumber(metadata.dexNumber)}</h2>
        <p className="species-name">{capitalizeFirstLetter(metadata.name)}</p>
      </div>
    </div>
  );
}

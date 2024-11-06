import { useNavigate, useParams } from "react-router-dom";
import "./PokedexSpeciesPage.css";
import { useState, useEffect } from "react";
import { usePokedexEntry } from "../../controllers/PokedexController";
import PokedexNavigation from "../../components/pokedex/pokedex-navigation/PokedexNavigation";
import {
  capitalizeFirstLetter,
  formatDexNumber,
} from "../../components/utils/utils";

export default function PokedexSpeciesPage() {
  const { dexNumber } = useParams();
  const navigate = useNavigate();
  const initialEntry = dexNumber ? parseInt(dexNumber, 10) : 1;
  const [currentEntry, setCurrentEntry] = useState(initialEntry);
  const [dexEntry, setDexEntry] = useState({});

  // ---- Get species entry ----
  const { entry, isLoading, error, refresh, entryMetadata } =
    usePokedexEntry(currentEntry);
  useEffect(() => {
    setDexEntry(entry);
  }, [entry]);

  return (
    <div className="species-page-container">
      <div className="species-contents">
        <div className="species-navigation">
          <PokedexNavigation metadata={entryMetadata.previous} />
          <PokedexNavigation metadata={entryMetadata.next} isNext={true} />
        </div>
        <div className="species-entry">
          <div className="species-title">
            <h1 className="name-species">
              {capitalizeFirstLetter(dexEntry.name)}
            </h1>
            <h1 className="species-num">
              {formatDexNumber(dexEntry.dexNumber)}
            </h1>
          </div>
          <div className="species-carousal"></div>
        </div>
      </div>
    </div>
  );
}

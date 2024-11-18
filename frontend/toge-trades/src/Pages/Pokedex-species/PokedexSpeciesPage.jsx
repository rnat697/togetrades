import { useNavigate, useParams } from "react-router-dom";
import "./PokedexSpeciesPage.css";
import { useState, useEffect } from "react";
import { usePokedexEntry } from "../../controllers/PokedexController";
import PokedexNavigation from "../../components/pokedex/pokedex-navigation/PokedexNavigation";
import { DexImage } from "../../components/pokedex/dex-image/DexImage";
import { toast } from "react-toastify";
import { Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import {
  capitalizeFirstLetter,
  convertDecimeterToMeters,
  convertHectogramToKilogram,
  formatDexNumber,
} from "../../components/utils/utils";
import PokemonType from "../../components/pokemon-type/PokemonType";
import InfoTag from "../../components/info-tag/InfoTag";

export default function PokedexSpeciesPage() {
  const { dexNumber } = useParams();
  const navigate = useNavigate();
  // MAX species is 1025 so around 52 pages
  let initialEntry =
    isNaN(parseInt(dexNumber)) ||
    parseInt(dexNumber) < 1 ||
    parseInt(dexNumber) > 1025
      ? 1
      : parseInt(dexNumber);
  const [currentEntry, setCurrentEntry] = useState(initialEntry);
  const [dexEntry, setDexEntry] = useState({});

  // ---- Redirect if dexNumber is invalid ----
  useEffect(() => {
    // Redirect to `/pokedex/entry/1`
    if (initialEntry !== parseInt(dexNumber)) {
      navigate(`/pokedex/entry/${initialEntry}`);
    }
  }, [initialEntry, dexNumber, navigate]);

  // ---- Get species entry ----
  const { entry, isLoading, error, refresh, entryMetadata } =
    usePokedexEntry(currentEntry);
  if (error) toast.error("Error fetching species");
  useEffect(() => {
    setDexEntry(entry);
  }, [entry]);

  // ---- Update Tab title ----
  useEffect(() => {
    if (dexEntry.name) {
      document.title = `${capitalizeFirstLetter(
        dexEntry.name
      )} - Pokedex Entry | Toge Trades`;
    } else {
      document.title = "Loading... - Pokedex Entry | Toge Trades";
    }
  }, [dexEntry.name]);

  const handleEntryChange = (metadata) => {
    setCurrentEntry(metadata.dexNumber);
    navigate(`/pokedex/entry/${metadata.dexNumber}`);
  };
  const isPreviousDefined = entryMetadata && entryMetadata.previous;
  const isNextDefined = entryMetadata && entryMetadata.next;
  const status = isNextDefined && !isPreviousDefined ? "next-only" : "";
  return (
    <div className="species-page-container">
      <div className="species-contents">
        <div className={`species-navigation ${status}`}>
          {isPreviousDefined && (
            <div className="left-nav">
              <PokedexNavigation
                metadata={entryMetadata.previous}
                onClick={handleEntryChange}
                className="previous"
              />
            </div>
          )}
          {isNextDefined && (
            <div className="right-nav">
              <PokedexNavigation
                metadata={entryMetadata.next}
                isNext={true}
                onClick={handleEntryChange}
                className="next-move"
              />
            </div>
          )}
        </div>
        <div className="species-entry">
          {isLoading || !dexEntry ? (
            <div className="pokebox-loader">
              <l-infinity
                size="55"
                stroke="4"
                stroke-length="0.15"
                bg-opacity="0.1"
                speed="1.3"
                color="#78A7E2"
              />
            </div>
          ) : (
            // Only render this if dexEntry exists and has necessary properties
            dexEntry.name &&
            dexEntry.dexNumber && (
              <div className="species-entry-content">
                <div className="species-title">
                  <h1 className="name-species">
                    {capitalizeFirstLetter(dexEntry.name)}
                  </h1>
                  <h1 className="species-num">
                    {formatDexNumber(dexEntry.dexNumber)}
                  </h1>
                </div>
                <div className="species-carousel">
                  <Swiper
                    modules={[Pagination, A11y]}
                    slidesPerView={1}
                    centeredSlides={true}
                    spaceBetween={3}
                    pagination={{ clickable: true }}
                    className="species-swiper"
                  >
                    <SwiperSlide>
                      <DexImage imageSrc={dexEntry.image.normal} />
                    </SwiperSlide>
                    <SwiperSlide>
                      <DexImage imageSrc={dexEntry.image.shiny} />
                    </SwiperSlide>
                  </Swiper>
                </div>
                <div className="species-type">
                  {dexEntry.types.map((type, index) => (
                    <PokemonType
                      key={`species-type-${type}-${index}`}
                      type={type}
                    />
                  ))}
                </div>
                <div className="species-dex-entry-content">
                  <h2>Pokedex Entry</h2>
                  <p>
                    {dexEntry.dexEntry === ""
                      ? "Pokedex entry unavailable. We don't have it stored on our database at the moment."
                      : dexEntry.dexEntry}
                  </p>
                </div>
                <div className="species-info-tags">
                  <InfoTag
                    title={"Height"}
                    subtitle={
                      convertDecimeterToMeters(dexEntry.height).toString() +
                      " m"
                    }
                  />
                  <InfoTag
                    title={"Weight"}
                    subtitle={
                      convertHectogramToKilogram(dexEntry.weight).toString() +
                      " kg"
                    }
                  />
                  <InfoTag
                    title={"Owned?"}
                    subtitle={`${dexEntry.isMissing ? "No" : "Yes"}`}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

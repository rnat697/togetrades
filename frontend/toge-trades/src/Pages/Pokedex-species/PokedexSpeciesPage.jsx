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
  formatDexNumber,
} from "../../components/utils/utils";

export default function PokedexSpeciesPage() {
  const { dexNumber } = useParams();
  const navigate = useNavigate();
  const initialEntry = dexNumber ? parseInt(dexNumber, 10) : 1;
  console.log(initialEntry);
  const [currentEntry, setCurrentEntry] = useState(initialEntry);
  const [dexEntry, setDexEntry] = useState({});

  // ---- Get species entry ----
  const { entry, isLoading, error, refresh, entryMetadata } =
    usePokedexEntry(currentEntry);
  if (error) toast.error("Error fetching species");
  useEffect(() => {
    setDexEntry(entry);
  }, [entry]);

  const handleEntryChange = (metadata) => {
    setCurrentEntry(metadata.dexNumber);
  };
  const isPreviousDefined = entryMetadata && entryMetadata.previous;
  const isNextDefined = entryMetadata && entryMetadata.next;
  const status =
    isPreviousDefined && !isNextDefined
      ? "previous-only"
      : isNextDefined && !isPreviousDefined
      ? "next-only"
      : "";
  return (
    <div className="species-page-container">
      <div className="species-contents">
        <div className={`species-navigation ${status}`}>
          {isPreviousDefined && (
            <PokedexNavigation
              metadata={entryMetadata.previous}
              onClick={handleEntryChange}
              className="previous"
            />
          )}
          {isNextDefined && (
            <PokedexNavigation
              metadata={entryMetadata.next}
              isNext={true}
              onClick={handleEntryChange}
              className="next-move"
            />
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
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

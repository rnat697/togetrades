import { useNavigate, useParams } from "react-router-dom";
import styles from "./TradeHubPage.module.css";
import NewListing from "../../components/trade-hub/new-listing/NewListing";
import { useState } from "react";
import ListingSelectionModal from "../../components/trade-hub/new-listing/listing-selection/ListingSelectionModal";
import { useListings } from "../../controllers/ListingsController";
import "ldrs/infinity";
import ReactPaginate from "react-paginate";
import { ToastContainer } from "react-toastify";
import ListingCards from "../../components/trade-hub/listing-cards/ListingCards";

export default function TradeHubPage() {
  const [showOfferModal, setShowOffer] = useState(false);
  const [showSeekModal, setShowSeek] = useState(false);
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [isSeekingShiny, setIsSeekingShiny] = useState(false);

  const { page } = useParams();
  const navigate = useNavigate();
  const initialPage = page ? parseInt(page, 10) : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { listings, isLoading, error, refresh, listingsMetadata } =
    useListings(currentPage);
  if (error) toast.error(error);

  // ----- Offer/seek modal handling ----
  const openListingSelectionModal = (isOffered) => {
    if (isOffered) {
      setShowOffer(true);
      setShowSeek(false);
    } else {
      setShowSeek(true);
      setShowOffer(false);
    }
  };
  const handleOfferModalClose = () => {
    setShowOffer(false);
  };
  const handleOfferModalConfirm = (pokemon, isSeekingShiny) => {
    setShowOffer(false);
    setPokemon(pokemon);
  };
  const handleSeekModalClose = () => {
    setShowSeek(false);
  };
  const handleSeekModalConfirm = (species, isSeekingShiny) => {
    setShowSeek(false);
    setSpecies(species);
    setIsSeekingShiny(isSeekingShiny);
  };

  const handleSuccessNewListing = () => {
    setPokemon(null);
    setSpecies(null);
    setIsSeekingShiny(false);
  };

  return (
    <div className={styles["trade-hub-container"]}>
      <div className={styles["trade-hub-content"]}>
        <div className={styles["trade-hub-title"]}>
          <h1>Trade Hub</h1>
          <p>Trade Pokémon to complete your Pokedex!</p>
        </div>
        <div className={styles["hub-nav"]}>
          <p>!!! Hub navs to be implemented !!!</p>
        </div>
        <div className={styles["create-listing-container"]}>
          <NewListing
            onClicked={(isOffered) => openListingSelectionModal(isOffered)}
            species={species}
            pokemon={pokemon}
            isShinyWanted={isSeekingShiny}
            onSuccess={handleSuccessNewListing}
          />
        </div>
        <ListingSelectionModal
          showModal={showOfferModal}
          isOffered={true}
          onClose={handleOfferModalClose}
          onConfirm={handleOfferModalConfirm}
        />
        <ListingSelectionModal
          showModal={showSeekModal}
          isOffered={false}
          onClose={handleSeekModalClose}
          onConfirm={handleSeekModalConfirm}
        />
        <div className={styles["hub-title-listings"]}>
          <h3>Recent Listings</h3>
          <button>Refresh</button>
        </div>
        <div className={styles["hub-listings"]}>
          {listings.map((listing) => (
            <ListingCards
              key={listing.id}
              listing={listing}
              // isInMyListings={true}
            />
          ))}
          {isLoading && (
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
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

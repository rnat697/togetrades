import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./TradeHubPage.module.css";
import NewListing from "../../components/trade-hub/new-listing/NewListing";
import { useState, useEffect } from "react";
import ListingSelectionModal from "../../components/trade-hub/new-listing/listing-selection/ListingSelectionModal";
import { useListings } from "../../controllers/ListingsController";
import "ldrs/infinity";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import ListingCards from "../../components/trade-hub/listing-cards/ListingCards";
import Divider from "../../components/divider/Divider";

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

  // ---- Update document title based on the current page ----
  useEffect(() => {
    document.title = `Trade Hub - Page ${currentPage} | Toge Trades`;
  }, [currentPage, listings]);

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
  const handleOfferModalConfirm = (pokemon) => {
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

  // --- Handle Refresh ---
  const handleRefresh = () => {
    refresh();
  };
  // --- Handle page change ---
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1); // react-paginate uses 0-based index
    navigate(`/tradehub/${selected + 1}`); // Update the URL
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles["trade-hub-container"]}>
      <div className={styles["trade-hub-content"]}>
        <div className={styles["trade-hub-title"]}>
          <h1>Trade Hub</h1>
          <p>Trade Pokémon to complete your Pokedex!</p>
        </div>
        <div className={styles["hub-nav-container"]}>
          <div className={styles["hub-nav"]}>
            <Link className={styles["hub-link"]}>Incoming Offers</Link>
            <Link
              className={styles["hub-link"]}
              to={"/tradehub/outgoing-offers"}
            >
              Outgoing Offers
            </Link>
            <Link className={styles["hub-link"]}>My Listings</Link>
          </div>
          <Divider />
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
          <button onClick={handleRefresh}>Refresh</button>
        </div>
        <div className={styles["hub-listings"]}>
          {listings.map((listing) => (
            <ListingCards key={listing.id} listing={listing} />
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
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          pageCount={listingsMetadata?.totalPages ?? 1}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName={styles["pagination"]}
          activeClassName={styles["pagination-active"]}
          pageClassName={styles["page-item"]}
          previousClassName={styles["page-item"]}
          nextClassName={styles["page-item"]}
          breakClassName={styles["page-item"]}
        />
        <ToastContainer />
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import Breadcrumb from "../../components/trade-hub/breadcrumb/breadcrumb";
import { getByListingId } from "../../controllers/ListingsController";
import styles from "./ListingPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "ldrs/infinity";
import { useAuth } from "../../api/auth";
import ListingDetail from "../../components/listing/listing-details/ListingDetail";
import TradeOfferBox from "../../components/listing/trade-offer-box/TradeOfferBox";
import OfferCard from "../../components/offer/offer-card/OfferCard";

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [listing, setListing] = useState({});
  const [metadata, setMetadata] = useState({});
  const [acceptedOffer, setAcceptedOffer] = useState({});
  const [offersLength, setOffersLength] = useState(0);
  // ---- Get listing ---
  useEffect(() => {
    getByListingId(id).then((data) => {
      setListing(data.listing);
      setAcceptedOffer(data.listing.acceptedOffer);
      setOffersLength(data.listing.offers.length);
      setMetadata(data.metadata);
      setIsCurrentUser(user._id === data.listing.listedBy.id); // only show interested In trading box if its not the same user
    });
  }, [id]);

  // ---- Update document title based on the current page ----
  useEffect(() => {
    if (listing.listingNum) {
      document.title = `Listing #${listing.listingNum
        .toString()
        .padStart(4, "0")} | Toge Trades`;
    }
  }, [listing]);

  // ---- update offers list with the accepted offer FE ---
  const handleOfferAccept = (offer) => {
    setOffersLength(0);
    setAcceptedOffer(offer);
  };

  // ---- update offers list when offer is declined ---
  const handleOfferDecline = (offer) => {
    const updatedOffers = listing.offers.filter((item) => item.id !== offer.id);
    setOffersLength(updatedOffers.length);
    const updatedListing = listing;
    updatedListing.offers = updatedOffers;
    setListing(updatedListing);
  };

  return (
    <div className={styles["listing-page-container"]}>
      {Object.keys(listing).length === 0 ? (
        <div className={styles["listing-loader"]}>
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
        <div className={styles["listing-page-all"]}>
          <Breadcrumb
            currentPageName={`Listing #${listing.listingNum
              .toString()
              .padStart(4, "0")}`}
          />
          <div className={styles["listing-page-contents"]}>
            <ListingDetail listing={listing} metadata={metadata} />

            {isCurrentUser ? (
              <div className={styles["my-offers-container"]}>
                <h2>Offers</h2>
                {offersLength === 0 ? (
                  acceptedOffer != null ? (
                    <div>
                      <OfferCard
                        offerData={acceptedOffer}
                        listingOffering={{
                          pokemon: listing.offeringPokemon,
                          isShiny: listing.isSeekingShiny,
                        }}
                        isAcceptedOffer={true}
                        isIncomingOffer={true}
                      />
                    </div>
                  ) : (
                    <div className={styles["no-offers"]}>
                      <h3>No offers yet.</h3>
                    </div>
                  )
                ) : (
                  listing.offers.map((offer) => (
                    <div className={styles["offers-card-rows"]} key={offer.id}>
                      <OfferCard
                        offerData={offer}
                        listingOffering={{
                          pokemon: listing.offeringPokemon,
                          isShiny: listing.isSeekingShiny,
                        }}
                        isIncomingOffer={isCurrentUser}
                        onOfferAccepted={handleOfferAccept}
                        onOfferDeclined={handleOfferDecline}
                      />
                    </div>
                  ))
                )}
              </div>
            ) : (
              <TradeOfferBox
                seeking={listing.seekingSpecies}
                listingId={listing.id}
              />
            )}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

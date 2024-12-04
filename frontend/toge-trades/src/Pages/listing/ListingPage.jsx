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

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [listing, setListing] = useState({});
  const [metadata, setMetadata] = useState({});

  // ---- Get listing ---
  useEffect(() => {
    getByListingId(id).then((data) => {
      setListing(data.listing);
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

            <TradeOfferBox seeking={listing.seekingSpecies} />
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

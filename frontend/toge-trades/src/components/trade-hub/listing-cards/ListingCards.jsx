import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "../../utils/utils";
import ListingTradeIcons from "../trade-transfer-icons/ListingTradeIcons";
import styles from "./ListingCards.module.css";

export default function ListingCards({ listing, isInMyListings = false }) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    console.log("i clicked");
    navigate(`/tradehub/listing/${listing.id}`);
  };
  return (
    <div className={styles["listing-card-container"]}>
      <div className={styles["title"]}>
        <h3>{`Listing #${listing.listingNum.toString().padStart(4, "0")}`}</h3>
        {isInMyListings ? (
          <div
            className={`${styles["listing-status"]} ${
              listing.status === "Active" ? styles["active"] : ""
            }  `}
          >
            <p>{listing.status}</p>
          </div>
        ) : (
          <div className={styles["user"]}>
            <img src={listing.listedBy.image} />
            <p>{listing.listedBy.username}</p>
          </div>
        )}
      </div>
      <div className={styles["trades"]}>
        <ListingTradeIcons
          offered={listing.offeringPokemon}
          seeking={listing.seekingSpecies}
          isSeekingShiny={listing.isSeekingShiny}
        />
      </div>
      <div className={styles["listing-btn"]}>
        <button onClick={handleOnClick}>View Listing</button>
        <p>{`Posted ${formatRelativeTime(listing.dateCreated)}`}</p>
      </div>
    </div>
  );
}

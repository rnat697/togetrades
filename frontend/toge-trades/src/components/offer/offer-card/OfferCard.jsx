import { Link } from "react-router-dom";
import styles from "./OfferCard.module.css";
import ListingTradeIcons from "../../trade-hub/trade-transfer-icons/ListingTradeIcons";
import { capitalizeFirstLetter, formatRelativeTime } from "../../utils/utils";

export default function OfferCard({
  offerData,
  listingOffering,
  isIncomingOffer = false,
  showStatus = false,
}) {
  const offeredMessage = isIncomingOffer
    ? `They offered ${capitalizeFirstLetter(
        offerData.offeredPokemon.species.name
      )}`
    : `You offered ${capitalizeFirstLetter(
        offerData.offeredPokemon.species.name
      )} `;

  const seekMessage = isIncomingOffer
    ? `For your ${capitalizeFirstLetter(listingOffering.pokemon.species.name)}`
    : `For their ${capitalizeFirstLetter(
        listingOffering.pokemon.species.name
      )} `;

  return (
    <div className={styles["offer-card-container"]}>
      <div className={styles["header"]}>
        <h3>{`Offer #${offerData.offerNum.toString().padStart(4, "0")}`}</h3>
        {isIncomingOffer ? null : (
          <p>
            {`Made an offer on your `}
            <Link
              to={`/tradehub/listing/${offerData.listing._id}`}
            >{`Listing #${offerData.listing.listingNum
              .toString()
              .padStart(4, "0")}`}</Link>
          </p>
        )}
        {showStatus ? (
          <div className={styles["offer-status"]}>{/**TODO: add status */}</div>
        ) : (
          <div className={styles["offer-user"]}>
            <img src={offerData.offeredBy.image} />
            <p>{offerData.offeredBy.username}</p>
          </div>
        )}
      </div>
      <ListingTradeIcons
        offered={offerData.offeredPokemon}
        seeking={listingOffering.pokemon.species}
        isSeekingShiny={listingOffering.isShiny}
        isOnOfferCard={true}
        offerCardOfferMsg={offeredMessage}
        offerCardSeekMsg={seekMessage}
      />
      <div className={styles["offer-buttons"]}>
        {isIncomingOffer ? (
          <div className={styles["accept-decline"]}>
            <button>Accept</button>
            <div className={styles["outline-butto"]}>
              <button>Decline</button>
            </div>
          </div>
        ) : (
          <div className={styles["outline-button"]}>
            <button>Withdraw</button>
          </div>
        )}
        <p>{`Offered ${formatRelativeTime(offerData.dateCreated)}`}</p>
      </div>
    </div>
  );
}

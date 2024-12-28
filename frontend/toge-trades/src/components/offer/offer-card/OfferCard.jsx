import { Link } from "react-router-dom";
import styles from "./OfferCard.module.css";
import ListingTradeIcons from "../../trade-hub/trade-transfer-icons/ListingTradeIcons";
import { capitalizeFirstLetter, formatRelativeTime } from "../../utils/utils";
import OfferStatus from "../offer-status/OfferStatus";
import { useState } from "react";
import ConfirmationModal from "../../confirmation_modal/ConfirmationModal";
import {
  acceptOffer,
  declineOffer,
  withdrawOffer,
} from "../../../controllers/OfferController";

export default function OfferCard({
  offerData,
  listingOffering,
  isIncomingOffer = false,
  showStatus = false,
  isAcceptedOffer = false,
  onOfferAccepted,
  onOfferDeclined,
  showListingOrigin = false,
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalActionMsg, setModalActionMsg] = useState();
  const [modalButtonLabel, setModalButtonLabel] = useState("");
  const [isModalRed, setIsModalRed] = useState(false);

  // ----- offer card titles -----
  const offeredPokeName = capitalizeFirstLetter(
    offerData.offeredPokemon.species.name
  );
  const offeredMessage = isIncomingOffer
    ? `They offered ${offeredPokeName}`
    : `You offered ${offeredPokeName} `;

  const listingPokeName = capitalizeFirstLetter(
    listingOffering.pokemon.species.name
  );

  const seekMessage = isIncomingOffer
    ? `For your ${listingPokeName}`
    : `For their ${listingPokeName} `;

  // ----- ACCEPTED MODAL MSG -----
  const handleAcceptedClick = () => {
    setModalTitle("Accept Trade Offer");
    setModalMessage(
      `You're about to accept ${offerData.offeredBy.username}'s ${offeredPokeName} in exchange for your ${listingPokeName}.`
    );
    const actionMsg = (
      <>
        Once accepted, this trade{" "}
        <span style={{ color: "red" }}>can not be reversed</span> and this
        listing will be <span style={{ color: "red" }}>inactive</span>.
      </>
    );
    setModalActionMsg(actionMsg);
    setModalButtonLabel("Accept");
    setIsModalRed(false);
    setShowConfirmModal(true);
  };

  // ----- DECLINE MODAL MSG -----
  const handleDeclineClick = () => {
    setModalTitle("Decline Trade Offer");
    setModalMessage(
      `Are you sure you want to decline ${offerData.offeredBy.username}'s offer to trade their ${offeredPokeName} for your ${listingPokeName}?`
    );
    setModalActionMsg("");
    setModalButtonLabel("Decline");
    setIsModalRed(true);
    setShowConfirmModal(true);
  };
  // ----- WITHDRAW MODAL MSG -----
  const handleWithdrawClick = () => {
    setModalTitle("Withdraw Trade Offer");
    setModalMessage(
      `Are you sure you want to withdraw your offer to trade your ${offeredPokeName} for ${offerData.offeredBy.username}'s ${listingPokeName}?`
    );
    const actionMsg = (
      <>
        Once withdrawn, this offer will be{" "}
        <span style={{ color: "red" }}>permanently deleted</span>.
      </>
    );
    setModalActionMsg(actionMsg);
    setModalButtonLabel("Withdraw");
    setIsModalRed(true);
    setShowConfirmModal(true);
  };
  // ----- MODAL CLOSE AND CONFIRMATION -----
  const handleModalOnClose = () => {
    setShowConfirmModal(false);
  };
  const handleConfirmation = () => {
    if (modalButtonLabel === "Accept") {
      acceptOffer(offerData.id).then((success) => {
        if (success) {
          offerData.setStatus("Accepted"); // upate it locally
          onOfferAccepted(offerData);
        }
      });
    } else if (modalButtonLabel === "Decline") {
      declineOffer(offerData.id).then((success) => {
        if (success) {
          offerData.setStatus("Declined");
          onOfferDeclined(offerData);
        }
      });
    } else if (modalButtonLabel === "Withdraw") {
      withdrawOffer(offerData.id).then((success) => {
        if (success) {
          onOfferWithdraw();
        }
      });
    }
  };

  return (
    <div className={styles["offer-card-container"]}>
      <div className={styles["header"]}>
        <h3>{`Offer #${offerData.offerNum.toString().padStart(4, "0")}`}</h3>
        {showListingOrigin ? (
          <p>
            {`Made an offer on `}
            <Link
              to={`/tradehub/listing/${offerData.listing._id}`}
            >{`Listing #${offerData.listing.listingNum
              .toString()
              .padStart(4, "0")}`}</Link>
          </p>
        ) : null}
        {showStatus ? (
          <div className={styles["offer-status"]}>
            {<OfferStatus status={offerData.status} />}
          </div>
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
        {isAcceptedOffer ? (
          <OfferStatus status={offerData.status} />
        ) : isIncomingOffer ? (
          <div className={styles["accept-decline"]}>
            <button onClick={handleAcceptedClick}>Accept</button>
            <div className={styles["outline-button"]}>
              <button onClick={handleDeclineClick}>Decline</button>
            </div>
          </div>
        ) : (
          <div className={styles["outline-button"]}>
            <button onClick={handleWithdrawClick}>Withdraw</button>
          </div>
        )}
        <p>{`Offered ${formatRelativeTime(offerData.dateCreated)}`}</p>
      </div>
      <ConfirmationModal
        title={modalTitle}
        message={modalMessage}
        actionMessage={modalActionMsg}
        primaryButtonLabel={modalButtonLabel}
        isButtonRed={isModalRed}
        showModal={showConfirmModal}
        onClose={handleModalOnClose}
        onConfirm={handleConfirmation}
      />
    </div>
  );
}

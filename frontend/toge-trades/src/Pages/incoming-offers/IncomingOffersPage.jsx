import styles from "./IncomingOffersPage.module.css";
import Breadcrumb from "../../components/trade-hub/breadcrumb/breadcrumb";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "ldrs/infinity";
import ReactPaginate from "react-paginate";
import { useIncomingOffers } from "../../controllers/OfferController";
import OfferCard from "../../components/offer/offer-card/OfferCard";

export default function IncomingOffersPage({}) {
  const { page } = useParams();
  const navigate = useNavigate();
  const initialPage = page ? parseInt(page, 10) : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { offers, isLoading, error, refresh, offersMetadata } =
    useIncomingOffers(currentPage);
  if (error) toast.error(error);

  // ---- Update document title based on the current page ----
  useEffect(() => {
    document.title = `Incoming Offers - Page ${currentPage} | Toge Trades`;
  }, [currentPage, offers]);

  // --- Handle page change ---
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
    navigate(`/tradehub/outgoing-offers/${selected + 1}`);
    window.scrollTo(0, 0);
  };

  // ---- update offers list with the accepted offer FE ---
  const handleOfferStatusChange = (offer) => {
    refresh();
  };

  return (
    <div className={styles["incoming-offers-container"]}>
      <div className={styles["breadcrumb"]}>
        <Breadcrumb currentPageName={"Incoming Trade Offers"} />
      </div>
      <h1>Incoming Offers</h1>
      <div className={styles["incoming-offers-items"]}>
        {isLoading ? (
          <l-infinity
            size="55"
            stroke="4"
            stroke-length="0.15"
            bg-opacity="0.1"
            speed="1.3"
            color="#78A7E2"
          />
        ) : offersMetadata.isEmpty ? (
          <p>You haven't made any offers yet. </p>
        ) : (
          offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offerData={offer}
              listingOffering={{
                pokemon: offer.listing.offeringPokemon,
                isShiny: offer.listing.offeringPokemon.isShiny,
              }}
              isIncomingOffer={true}
              showListingOrigin={true}
              onOfferAccepted={handleOfferStatusChange}
              onOfferDeclined={handleOfferStatusChange}
            />
          ))
        )}
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        pageCount={offersMetadata?.totalPages ?? 1}
        previousLabel="<"
        renderOnZeroPageCount={null}
        containerClassName={styles["pagination"]}
        activeClassName={styles["pagination-active"]}
        pageClassName={styles["page-item"]}
        previousClassName={styles["page-item"]}
        nextClassName={styles["page-item"]}
        breakClassName={styles["page-item"]}
      />
    </div>
  );
}

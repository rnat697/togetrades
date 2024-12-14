import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/trade-hub/breadcrumb/breadcrumb";
import styles from "./OutgoingOffersPage.module.css";
import { useOutgoingOffers } from "../../controllers/OfferController";
import "ldrs/infinity";
import OfferCard from "../../components/offer/offer-card/OfferCard";
import ReactPaginate from "react-paginate";

export default function OutgoingOffersPage({}) {
  const { page } = useParams();
  const navigate = useNavigate();
  const initialPage = page ? parseInt(page, 10) : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { offers, isLoading, error, refresh, offersMetadata } =
    useOutgoingOffers(currentPage);
  if (error) toast.error(error);

  // ---- Update document title based on the current page ----
  useEffect(() => {
    document.title = `Outgoing Offers - Page ${currentPage} | Toge Trades`;
  }, [currentPage, offers]);

  // --- Handle page change ---
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
    navigate(`/tradehub/outgoing-offers/${selected + 1}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles["outgoing-offers-container"]}>
      <div className={styles["breadcrumb"]}>
        <Breadcrumb currentPageName={"Outgoing Trade Offers"} />
      </div>
      <div className={styles["header"]}>
        <h1>Outgoing Trade Offers</h1>
      </div>

      <div className={styles["outgoing-offers-items"]}>
        {isLoading ? (
          <l-infinity
            size="55"
            stroke="4"
            stroke-length="0.15"
            bg-opacity="0.1"
            speed="1.3"
            color="#78A7E2"
          />
        ) : (
          offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offerData={offer}
              listingOffering={{
                pokemon: offer.listing.offeringPokemon,
                isShiny: offer.listing.offeringPokemon.isShiny,
              }}
              showStatus={true}
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

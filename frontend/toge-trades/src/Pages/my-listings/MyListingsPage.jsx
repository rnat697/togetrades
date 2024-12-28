import styles from "./MyListingsPage.module.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/trade-hub/breadcrumb/breadcrumb";
import "ldrs/infinity";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { useUserListings } from "../../controllers/ListingsController";
import ListingCards from "../../components/trade-hub/listing-cards/ListingCards";

export default function MyListingsPage({}) {
  const { page } = useParams();
  const navigate = useNavigate();
  const initialPage = page ? parseInt(page, 10) : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { listings, isLoading, error, refresh, listingsMetadata } =
    useUserListings(currentPage);
  if (error) toast.error(error);
  const [filteredListings, setFilteredListings] = useState(listings);

  // ---- Update document title based on the current page ----
  useEffect(() => {
    document.title = `Outgoing Offers - Page ${currentPage} | Toge Trades`;
  }, [currentPage, listings]);

  useEffect(() => {
    setFilteredListings(listings);
  }, [listings]);

  // --- Handle page change ---
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
    navigate(`/tradehub/my-listings/${selected + 1}`);
    window.scrollTo(0, 0);
  };

  const options = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const handleFilterChange = (selectedOption) => {
    if (selectedOption) {
      // Filter offers based on the selected status
      const filtered = listings.filter(
        (listing) => listing.status === selectedOption.value
      );
      setFilteredListings(filtered);
    } else {
      setFilteredListings(listings);
    }
  };

  return (
    <div className={styles["user-listings-container"]}>
      <div className={styles["breadcrumb"]}>
        <Breadcrumb currentPageName={"My Listings"} />
      </div>
      <h1>My Listings</h1>
      <div className={styles["filter"]}>
        <Select
          options={options}
          onChange={handleFilterChange}
          placeholder={"Filter by..."}
          isClearable
        />
      </div>
      <div className={styles["user-listings"]}>
        {isLoading ? (
          <l-infinity
            size="55"
            stroke="4"
            stroke-length="0.15"
            bg-opacity="0.1"
            speed="1.3"
            color="#78A7E2"
          />
        ) : filteredListings.length === 0 ? (
          <p>You haven't made any listings yet. </p>
        ) : (
          filteredListings.map((listing) => (
            <ListingCards
              key={listing.listingNum}
              listing={listing}
              isInMyListings={true}
            />
          ))
        )}
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        pageCount={listingsMetadata?.totalPages ?? 0}
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

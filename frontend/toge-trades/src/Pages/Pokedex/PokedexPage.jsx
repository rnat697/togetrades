import { useNavigate, useParams } from "react-router-dom";
import "./PokedexPage.css";
import { useState, useEffect } from "react";
import { getWishlist, usePokedex } from "../../controllers/PokedexController";
import { toast, ToastContainer } from "react-toastify";
import "ldrs/infinity";
import { Line } from "rc-progress";
import ReactPaginate from "react-paginate";
import PokedexCard from "../../components/pokedex/pokedex-card/PokedexCard";
import { useAuth } from "../../api/auth";

export default function PokedexPage() {
  const { page } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  // MAX species is 1025 so around 52 pages
  let initialPage =
    isNaN(parseInt(page)) || parseInt(page) < 1 || parseInt(page) > 52
      ? 1
      : parseInt(page);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [speciesData, setSpeciesData] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [wishlistData, setWishlist] = useState([]);

  // ---- Redirect if dexNumber is invalid ----
  useEffect(() => {
    // Redirect to `/pokedex/1`
    if (initialPage !== parseInt(page)) {
      navigate(`/pokedex/${initialPage}`);
    }
  }, [initialPage, page, navigate]);

  // ---- Get species in pokedex function ----
  const { speciesList, isLoading, error, refresh, speciesMetadata } =
    usePokedex(currentPage);
  if (error) toast.error(error);

  // ---- Get user's wishlist on first render ---
  useEffect(() => {
    getWishlist(user._id).then((data) => {
      setWishlist(data);
    });
  }, []);

  useEffect(() => {
    setSpeciesData(speciesList);
    setMetadata(speciesMetadata);
  }, [speciesList, speciesMetadata]);

  const handlePageChange = ({ selected }) => {
    setSpeciesData([]);
    setCurrentPage(selected + 1);
    navigate(`/pokedex/${selected + 1}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="pokedex-container">
      <div className="pokedex-content">
        <div className="pokedex-title">
          <h1>Pokedex</h1>
        </div>
        <div className="pokedex-progress">
          <p className="dex-progress-text">
            {metadata.foundCountAll
              ? `Owned ${metadata.foundCountAll} / ${metadata.totalCount}`
              : ""}
          </p>
          <Line
            percent={
              metadata.foundCountAll
                ? (metadata.foundCountAll / metadata.totalCount) * 100
                : 0
            }
            strokeColor={"#78A7E2"}
            className="dex-progress-bar"
            strokeWidth={2}
            trailWidth={2}
          />
        </div>
        <div className="pokedex-cards">
          {speciesData.map((species, index) => {
            const isWished = wishlistData.some(
              (item) => item.id === species.id
            );
            return (
              <PokedexCard
                key={species.id}
                species={species}
                isWishlisted={isWished}
              />
            );
          })}
        </div>
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
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          pageCount={metadata?.totalPages ?? 1}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          activeClassName="pagination-active"
          pageClassName="page-item"
          previousClassName="page-item"
          nextClassName="page-item"
          breakClassName="page-item"
        />
        <ToastContainer />
      </div>
    </div>
  );
}

import { useNavigate, useParams } from "react-router-dom";
import "./PokedexPage.css";
import { useState, useEffect } from "react";
import { usePokedex } from "../../controllers/PokedexController";
import { toast, ToastContainer } from "react-toastify";
import "ldrs/infinity";
import ReactPaginate from "react-paginate";

export default function PokedexPage() {
  const { page } = useParams();
  const navigate = useNavigate();
  const initialPage = page ? parseInt(page, 10) : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [speciesData, setSpeciesData] = useState([]);

  // ---- Get species in pokedex function ----
  const { speciesList, isLoading, error, refresh, speciesMetadata } =
    usePokedex(currentPage);
  if (error) toast.error(error);

  useEffect(() => {
    setSpeciesData(speciesList);
  }, [speciesList]);

  const handlePageChange = ({ selected }) => {
    setFilteredSpecies([]);
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
        <div className="pokedex-cards">
          {speciesData.map((species, index) => (
            <p>{species.name}</p>
          ))}
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
          pageCount={speciesMetadata?.totalPages ?? 1}
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

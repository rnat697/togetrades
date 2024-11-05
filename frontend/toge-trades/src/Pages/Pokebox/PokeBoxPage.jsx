import "./PokeBoxPage.css";
import { useState, useEffect } from "react";
import SearchBar from "../../components/pokebox/search-bar/SearchBar";
import PokeBoxCards from "../../components/pokebox/pokebox-cards/PokeBoxCards";
import PokemonDetails from "../../components/pokemon-details/PokemonDetails";
import { ToastContainer } from "react-toastify";
import "ldrs/infinity";
import { usePokeBox } from "../../controllers/PokeBoxController";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams } from "react-router-dom";

export default function PokeBoxPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPokeId, setSelectedPokeId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [filteredPokes, setFilteredPokes] = useState([]);
  const navigate = useNavigate();

  const { page } = useParams();
  const initialPage = page ? parseInt(page, 10) : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  // ----- Get pokemons in pokebox function --
  const { pokemonList, isLoading, error, refresh, pokeMetadata } =
    usePokeBox(currentPage);
  if (error) toast.error(error);

  useEffect(() => {
    searchQuery.length > 0
      ? setFilteredPokes(
          pokemonList.filter((pokemon) =>
            pokemon.species.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        )
      : setFilteredPokes(pokemonList);
  }, [pokemonList, searchQuery]);

  const selectedPokemon = pokemonList.find((poke) => poke.id == selectedPokeId);
  const handleDetailsClose = () => {
    setShowDetails(false);
    // Wait until after the transition has finished
    setTimeout(() => {
      setSelectedPokeId(null);
    }, 500);
  };
  const handleClick = (pokemon) => {
    setShowDetails(true);
    setSelectedPokeId(pokemon.id);
  };

  // Handle page change
  const handlePageChange = ({ selected }) => {
    console.log(selected);
    setFilteredPokes([]);
    setSelectedPokeId(null);
    setCurrentPage(selected + 1); // react-paginate uses 0-based index
    navigate(`/pokebox/${selected + 1}`); // Update the URL
    window.scrollTo(0, 0);
  };
  return (
    <div className="pokebox-container">
      <div className="box-content-container">
        <div className="pokebox-title">
          <h1>Poke Box</h1>
        </div>
        <div className="pokebox-search">
          <SearchBar
            placeholder={"Search for your Pokemon..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="pokebox-cards">
          {filteredPokes.map((pokemon, index) => (
            <PokeBoxCards
              key={index}
              pokemon={pokemon}
              onClick={() => handleClick(pokemon)}
            />
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
          pageCount={pokeMetadata?.totalPages}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          activeClassName="pagination-active"
          pageClassName="page-item"
          previousClassName="page-item"
          nextClassName="page-item"
          breakClassName="page-item"
        />

        <PokemonDetails
          showModal={showDetails}
          pokemon={selectedPokemon}
          onClose={handleDetailsClose}
          modalType={"pokebox"}
        />
        <ToastContainer />
      </div>
    </div>
  );
}

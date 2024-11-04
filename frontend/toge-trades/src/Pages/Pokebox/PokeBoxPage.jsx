import "./PokeBoxPage.css";
import { useState } from "react";
import SearchBar from "../../components/pokebox/search-bar/SearchBar";
import PokeBoxCards from "../../components/pokebox/pokebox-cards/PokeBoxCards";
import { useAuth } from "../../api/auth";
import useGet from "../../hooks/useGet";
import { USER_POKEMON_URL } from "../../api/urls";
import PokemonDetails from "../../components/pokemon-details/PokemonDetails";
import { ToastContainer } from "react-toastify";
import "ldrs/infinity";

export default function PokeBoxPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPokeId, setSelectedPokeId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const {
    data: pokemonList,
    isLoading,
    refresh,
  } = useGet(USER_POKEMON_URL(user._id), [], true);

  const filteredPokes =
    searchQuery.length > 0
      ? pokemonList.filter((pokemon) =>
          pokemon.species.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : pokemonList;

  const selectedPokemon = pokemonList.find(
    (poke) => poke._id == selectedPokeId
  );
  const handleDetailsClose = () => {
    setShowDetails(false);
    // Wait until after the transition has finished
    setTimeout(() => {
      setSelectedPokeId(null);
    }, 500);
  };
  const handleClick = (pokemon) => {
    setShowDetails(true);
    setSelectedPokeId(pokemon._id);
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

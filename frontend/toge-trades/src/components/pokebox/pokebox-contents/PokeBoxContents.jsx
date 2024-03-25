import "./PokeBoxContents.css";
import { useState, useEffect, useRef } from "react";
import SearchBar from "../search-bar/SearchBar";
import PokeBoxCards from "../pokebox-cards/PokeBoxCards";
// import { pokemonByUser } from "../../../api/api";
import { useAuth } from "../../../api/auth";
import useGet from "../../../hooks/useGet";
import { objectToQueryString } from "../../utils/utils";
import { USER_POKEMON_URL } from "../../../api/urls";

export default function PokeBoxContents() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
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
          <PokeBoxCards key={index} pokemon={pokemon} />
        ))}
        {isLoading && <div>Loading...</div>}
      </div>
    </div>
  );
}

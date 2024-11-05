import useGet from "../hooks/useGet";
import { useState, useEffect } from "react";
import PokemonModel from "../models/PokemonModel";
import { USER_POKEMON_URL } from "../api/urls";
import { useAuth } from "../api/auth";
import { toggleLocked } from "../api/api";

// --- Fetches user's pokemons ---
export function usePokeBox(currentPage) {
  const { user } = useAuth();
  const {
    data: rawData,
    isLoading,
    error,
    refresh,
  } = useGet(USER_POKEMON_URL(user._id), [], true, true, currentPage);
  const [pokemonList, setPokemonList] = useState([]);
  const [pokeMetadata, setPokeMetadata] = useState([]);
  useEffect(() => {
    if (rawData.success) {
      let pokeData = rawData.data;
      setPokeMetadata(rawData.metadata);

      const pokemon = pokeData.map((data) => PokemonModel.fromJSON(data));
      setPokemonList(pokemon);
    }
  }, [rawData]);
  return { pokemonList, isLoading, error, refresh, pokeMetadata };
}

// --- Toggle Locked pokemon ---
// Want to return the new isLocked value.
export function togglePokemonLock(pokemonId, newIsLocked) {
  return toggleLocked(pokemonId, newIsLocked).then((res) => {
    return newIsLocked;
  });
}

import useGet from "../hooks/useGet";
import { useState, useEffect } from "react";
import PokemonModel from "../models/PokemonModel";
import { USER_POKEMON_URL } from "../api/urls";
import { useAuth } from "../api/auth";
import { toggleLocked } from "../api/api";

// --- Fetches user's pokemons ---
export function usePokeBox() {
  const { user } = useAuth();
  const {
    data: rawData,
    isLoading,
    error,
    refresh,
  } = useGet(USER_POKEMON_URL(user._id), [], true);
  const [pokemonList, setPokemonList] = useState([]);
  useEffect(() => {
    if (rawData) {
      const pokemon = rawData.map((data) => PokemonModel.fromJSON(data));
      setPokemonList(pokemon);
    }
  }, [rawData]);
  return { pokemonList, isLoading, error, refresh };
}

// --- Toggle Locked pokemon ---
// Want to return the new isLocked value.
export function togglePokemonLock(pokemonId, newIsLocked) {
  return toggleLocked(pokemonId, newIsLocked).then((res) => {
    return newIsLocked;
  });
}

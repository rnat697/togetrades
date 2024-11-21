import { useState, useEffect } from "react";
import { allEligiblePokemon, createListing } from "../api/api";
import { useAuth } from "../api/auth";
import PokemonModel from "../models/PokemonModel";
import { toast } from "react-toastify";

export function getEligibleTradePokemon(page = 1) {
  return allEligiblePokemon(page)
    .then((res) => {
      if (res.status === 200) {
        const metadata = res.data.metadata;
        const pokemon = res.data.data.map((item) =>
          PokemonModel.fromJSON(item)
        );
        return { metadata, pokemon };
      }
    })
    .catch((e) => {
      toast(
        "Error when fetching pokemons eligible for trading: " +
          (e.response?.data?.message || "An unexpected error occurred")
      );
    });
}

export function createNewListing(pokeId, speciesId) {
  return createListing(pokeId, speciesId)
    .then((res) => {
      if (res.status === 201) {
        const message = res.data.message;
        toast(message);
        return res.data.success;
      }
    })
    .catch((e) => {
      toast(
        "Error when creating new listing: " +
          (e.response?.data?.message || "An unexpected error occurred")
      );
    });
}
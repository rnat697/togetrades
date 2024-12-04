import { useState, useEffect } from "react";
import {
  allEligiblePokemon,
  createListing,
  getSpecificListingAPI,
  specificEligiblePokemonAPI,
} from "../api/api";
import { useAuth } from "../api/auth";
import PokemonModel from "../models/PokemonModel";
import { toast } from "react-toastify";
import useGet from "../hooks/useGet";
import { LISTING_URL } from "../api/urls";
import ListingModel from "../models/ListingModel";

// ---- Fetches all elgible pokemon that user has ----
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

// ---- Creates a new listing ----
export function createNewListing(pokeId, speciesId, isSeekingShiny) {
  return createListing(pokeId, speciesId, isSeekingShiny)
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

// ---- Fetches all listings sorted by recency ----
export function useListings(currentPage) {
  const {
    data: rawData,
    isLoading,
    error,
    refresh,
  } = useGet(LISTING_URL, [], true, true, currentPage);
  const [listings, setListings] = useState([]);
  const [listingsMetadata, setListingsMetadata] = useState({});

  useEffect(() => {
    if (rawData.success) {
      let listingsData = rawData.data;
      setListingsMetadata(rawData.metadata);

      const listingModels = listingsData.map((data) =>
        ListingModel.fromJSON(data)
      );
      setListings(listingModels);
    }
  }, [rawData]);
  return { listings, isLoading, error, refresh, listingsMetadata };
}

// ---- Fetches a specific listing ----
export function getByListingId(listingId) {
  return getSpecificListingAPI(listingId)
    .then((res) => {
      if (res.status === 200) {
        const listing = ListingModel.fromJSON(res.data.data);
        const metadata = res.data.metadata;
        return { listing, metadata };
      }
    })
    .catch((e) => {
      toast(
        "Error when fetching a listing: " +
          (e.response?.data?.message || "An unexpected error occurred")
      );
    });
}

// ---- Fetches a eligible pokemon by id ----
export function getEligiblePokemonById(speciesId) {
  return specificEligiblePokemonAPI(speciesId)
    .then((res) => {
      if (res.status === 200) {
        const data = res.data;
        const isEmpty = data.isEmpty;
        const pokemon = data.data.map((poke) => PokemonModel.fromJSON(poke));
        return { pokemon, isEmpty };
      }
    })
    .catch((e) => {
      toast(
        "Error when fetching eligible pokemon: " +
          (e.response?.data?.message || "An unexpected error occurred")
      );
    });
}
import useGet from "../hooks/useGet";
import { useEffect, useState } from "react";
import SpeciesModel from "../models/SpeciesModel";
import { SPECIES_ALL_URL, SPECIES_ITEM_URL } from "../api/urls";
import { getWishlistAPI } from "../api/api";
import { toast } from "react-toastify";

// --- Fetches Species for pokedex ---
export function usePokedex(currentPage) {
  const {
    data: rawData,
    isLoading,
    error,
    refresh,
  } = useGet(SPECIES_ALL_URL, [], true, true, currentPage);
  const [speciesList, setSpeciesList] = useState([]);
  const [speciesMetadata, setSpeciesMetadata] = useState([]);

  useEffect(() => {
    if (rawData.success) {
      let speciesData = rawData.data;
      setSpeciesMetadata(rawData.metadata);

      const species = speciesData.map((data) => SpeciesModel.fromJSON(data));
      setSpeciesList(species);
    }
  }, [rawData]);
  return { speciesList, isLoading, error, refresh, speciesMetadata };
}

// --- Fetches specified species for pokedex entry ---
export function usePokedexEntry(currentEntryId) {
  const {
    data: rawData,
    isLoading,
    error,
    refresh,
  } = useGet(SPECIES_ITEM_URL(currentEntryId), [], true, false);
  const [entry, setEntry] = useState({});
  const [entryMetadata, setEntryMetadata] = useState([]);

  useEffect(() => {
    if (rawData.success) {
      let speciesData = rawData.data;
      setEntryMetadata(rawData.metadata);

      const species = SpeciesModel.fromJSON(speciesData);
      setEntry(species);
    }
  }, [rawData]);

  return { entry, isLoading, error, refresh, entryMetadata };
}

// --- Fetches user's wishlist ---
export function getWishlist(userId) {
  return getWishlistAPI(userId)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data.data[0]);
        const wishlisted = res.data.data.map((item) =>
          SpeciesModel.fromJSON(item.species)
        );
        return wishlisted;
      }
    })
    .catch((e) => {
      toast(
        "Error when fetching wishlist: " +
          (e.response?.data?.message || "An unexpected error occurred")
      );
    });
}

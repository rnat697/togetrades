import useGet from "../hooks/useGet";
import { USERS_INCUBATORS } from "../api/urls";
import { useEffect, useState } from "react";
import IncubatorModel from "../models/IncubatorModel";
import {
  cancelIncubatorAPI,
  createIncubator,
  hatchIncubatorAPI,
} from "../api/api";
import { toast } from "react-toastify";
import PokemonModel from "../models/PokemonModel";
export function useIncubators() {
  // ---- Fetches user's incubators ----
  const {
    data: rawData,
    isLoading,
    error,
    refresh,
  } = useGet(USERS_INCUBATORS, [], true);
  const [incubators, setIncubators] = useState([]);

  useEffect(() => {
    if (rawData) {
      const incubatorsList = rawData.map((data) =>
        IncubatorModel.fromJSON(data)
      );
      setIncubators(incubatorsList);
    }
  }, [rawData]);

  return { incubators, isLoading, error, refresh };
}

export function addNewIncubator(type, navigate) {
  // ---- Creates a new incubator for user ----
  createIncubator(type)
    .then((res) => {
      if (res.data.success) {
        navigate("/incubator", { replace: true });
      }
    })
    .catch((e) => {
      toast(
        "Error when adding incubator: " +
          (e.response?.data?.message || "An unexpected error occurred")
      );
    });
}

export function deleteIncubator(id) {
  // ---- Deletes an incubator for user ----
  // Returns the promise so we can refresh in the view
  return cancelIncubatorAPI(id)
    .then((res) => {
      if (res.status === 204) {
        toast("Incubator deleted successfully!");
      }
    })
    .catch((e) => {
      toast(
        "Error when deleting incubator: " +
          (e.response?.data?.message || "An unexpected error occurred")
      );
    });
}

export function hatchEgg(id) {
  // ---- hatches Egg and deletes incubator for user ----
  // Returns the promise so we can refresh in the view
  return hatchIncubatorAPI(id)
    .then((res) => {
      if (res.status === 200) {
        toast("Egg Hatched successfully!");
        return res.data;
      }
    })
    .catch((e) => {
      toast(
        "Error when deleting incubator: " +
          (e.response?.data?.message || "An unexpected error occurred")
      );
    });
}
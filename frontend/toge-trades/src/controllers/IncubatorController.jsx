import useGet from "../hooks/useGet";
import { USERS_INCUBATORS } from "../api/urls";
import { useEffect, useState } from "react";
import IncubatorModel from "../models/IncubatorModel";
import { createIncubator } from "../api/api";
import { toast } from "react-toastify";
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
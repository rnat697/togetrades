import useGet from "../hooks/useGet";
import { USERS_INCUBATORS } from "../api/urls";
import { useEffect, useState } from "react";
import IncubatorModel from "../models/IncubatorModel";

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

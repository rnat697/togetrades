import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../api/auth";

function axiosGet(url, token, requiresAuth) {
  if (!token || !requiresAuth) return axios.get(url);
  return axios.get(url, { withCredentials: true });
}

export default function useGet(url, initialState = null, requiresAuth = false) {
  const [data, setData] = useState(initialState);
  const [isLoading, setLoading] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosGet(url, token, requiresAuth);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [url, refreshToggle]);

  function refresh() {
    setRefreshToggle(!refreshToggle);
  }

  /**
   * Data: The data being fetched, or initialState if nothing's fetched yet
   * isLoading: True if the request is underway, false otherwise
   * error: null if no errors are detected. Otherwise, this will be an object describing the error.
   * refresh(): A function that can be called to re-send the request.
   */
  return { data, isLoading, error, refresh };
}

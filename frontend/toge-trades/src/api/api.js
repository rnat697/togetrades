import axios from "axios";
import {
  REGISTER_ACCOUNT_URL,
  LOGIN_URL,
  USERS_URL,
  USER_BY_ID_URL,
  ALL_USERS,
  USER_POKEMON_URL,
  TOGGLE_TRADEABLE_URL,
  TOGGLE_LOCKED_URL,
} from "./urls";

export const login = (username, password) =>
  axios.post(LOGIN_URL, { username, password }, { withCredentials: true });

export const signup = (username, email, password) =>
  axios.post(
    REGISTER_ACCOUNT_URL,
    { username, email, password },
    { withCredentials: true }
  );

export const allUsers = () => axios.get(ALL_USERS, { withCredentials: true });

export const toggleTradeable = (pokemonID, isTradeable) =>
  axios.patch(
    TOGGLE_TRADEABLE_URL(pokemonID),
    { isTradeable: isTradeable },
    { withCredentials: true }
  );

export const toggleLocked = (pokemonId, isLocked) =>
  axios.patch(
    TOGGLE_LOCKED_URL(pokemonId),
    { isLocked: isLocked },
    { withCredentials: true }
  );

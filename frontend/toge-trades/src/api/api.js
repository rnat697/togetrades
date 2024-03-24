import axios from "axios";
import {
  REGISTER_ACCOUNT_URL,
  LOGIN_URL,
  USERS_URL,
  USER_BY_ID_URL,
  ALL_USERS,
  USER_POKEMON_URL,
} from "./urls";

export const login = (username, password) =>
  axios.post(LOGIN_URL, { username, password }, { withCredentials: true });

export const signup = (email, username, password) =>
  axios.post(
    REGISTER_ACCOUNT_URL,
    { username, email, password },
    { withCredentials: true }
  );

export const allUsers = () => axios.get(ALL_USERS, { withCredentials: true });

export const userById = (userId) =>
  axios.get(USER_BY_ID_URL(userId), { withCredentials: true });

export const pokemonByUser = (id, query) =>
  axios.get(USER_POKEMON_URL(id), { withCredentials: true, params: query });
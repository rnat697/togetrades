import axios from "axios";
import {
  REGISTER_ACCOUNT_URL,
  LOGIN_URL,
  USERS_URL,
  USER_BY_ID_URL,
  ALL_USERS,
  USER_POKEMON_URL,
  TOGGLE_LOCKED_URL,
  CREATE_INCUBATOR_URL,
  DELETE_INCUBATOR_URL,
  HATCH_EGG_URL,
  WISHLIST_URL,
  ADD_TO_WISHLIST_URL,
  REMOVE_FROM_WISHLIST_URL,
  ALL_WISHLIST_URL,
} from "./urls";

// ------ USERS API ------
export const loginAPI = (username, password) =>
  axios.post(LOGIN_URL, { username, password }, { withCredentials: true });

export const signupAPI = (username, email, password) =>
  axios.post(
    REGISTER_ACCOUNT_URL,
    { username, email, password },
    { withCredentials: true }
  );

export const allUsers = () => axios.get(ALL_USERS, { withCredentials: true });

export const getAllWishlistAPI = (userId) =>
  axios.get(ALL_WISHLIST_URL(userId), { withCredentials: true });

export const addWishlist = (speciesId) =>
  axios.post(
    ADD_TO_WISHLIST_URL,
    { speciesId: speciesId },
    { withCredentials: true }
  );
export const removeWishlist = (speciesId) =>
  axios.delete(REMOVE_FROM_WISHLIST_URL, {
    data: { speciesId: speciesId },
    withCredentials: true,
  });

// ------ POKEMON API ------
export const toggleLocked = (pokemonId, isLocked) =>
  axios.patch(
    TOGGLE_LOCKED_URL(pokemonId),
    { isLocked: isLocked },
    { withCredentials: true }
  );

// ------ INCUBATOR API ------
export const createIncubator = (type) =>
  axios.post(CREATE_INCUBATOR_URL(type), {}, { withCredentials: true });

export const cancelIncubatorAPI = (id) =>
  axios.delete(DELETE_INCUBATOR_URL(id), { withCredentials: true });
export const hatchIncubatorAPI = (id) =>
  axios.delete(HATCH_EGG_URL(id), { withCredentials: true });
import axios from "axios";
import {
  REGISTER_ACCOUNT_URL,
  LOGIN_URL,
  ALL_USERS,
  TOGGLE_LOCKED_URL,
  CREATE_INCUBATOR_URL,
  DELETE_INCUBATOR_URL,
  HATCH_EGG_URL,
  ADD_TO_WISHLIST_URL,
  REMOVE_FROM_WISHLIST_URL,
  ALL_WISHLIST_URL,
  ALL_ELIGIBLE_POKEMON,
  CREATE_LISTING_URL,
  LISTING_DETAIL_URL,
  SPECIFIC_ELIGIBLE_POKEMON_URL,
  CREATE_OFFER_URL,
  OFFER_ACCEPT_URL,
  OFFER_DECLINE_URL,
  OFFER_WITHDRAW_URL,
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

export const allEligiblePokemon = (page) =>
  axios.get(`${ALL_ELIGIBLE_POKEMON}/?page=${page}&limit=15`, {
    withCredentials: true,
  });

export const specificEligiblePokemonAPI = (speciesId) =>
  axios.get(SPECIFIC_ELIGIBLE_POKEMON_URL(speciesId), {
    withCredentials: true,
  });

// ------ INCUBATOR API ------
export const createIncubator = (type) =>
  axios.post(CREATE_INCUBATOR_URL(type), {}, { withCredentials: true });

export const cancelIncubatorAPI = (id) =>
  axios.delete(DELETE_INCUBATOR_URL(id), { withCredentials: true });
export const hatchIncubatorAPI = (id) =>
  axios.delete(HATCH_EGG_URL(id), { withCredentials: true });

// ------ LISTING API ------
export const createListing = (
  offeredPokeId,
  seekSpeciesId,
  isSeekingShiny = false
) =>
  axios.post(
    CREATE_LISTING_URL,
    { offeredPokeId, seekSpeciesId, isSeekingShiny },
    { withCredentials: true }
  );

export const getSpecificListingAPI = (listingId) =>
  axios.get(LISTING_DETAIL_URL(listingId), { withCredentials: true });

// ------ OFFERS API ------
export const createOffer = (offeredPokeId, listingId) =>
  axios.post(
    CREATE_OFFER_URL,
    { offeredPokeId, listingId },
    { withCredentials: true }
  );

export const acceptOfferAPI = (offerId) =>
  axios.post(OFFER_ACCEPT_URL(offerId), {}, { withCredentials: true });

export const declineOfferAPI = (offerId) =>
  axios.post(OFFER_DECLINE_URL(offerId), {}, { withCredentials: true });

export const withdrawOfferAPI = (offerId) =>
  axios.delete(OFFER_WITHDRAW_URL(offerId), { withCredentials: true });
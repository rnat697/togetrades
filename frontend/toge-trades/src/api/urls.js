const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/v1`;

// ------ USERS ENDPOINTS ------
export const USERS_URL = `${API_BASE_URL}/users`;
export const REGISTER_ACCOUNT_URL = `${USERS_URL}/register`;
export const LOGIN_URL = `${USERS_URL}/login`;
export const ALL_USERS = `${USERS_URL}/`;
export const USER_BY_ID_URL = (userId) => `${USERS_URL}/${userId}`;
export const USER_POKEMON_URL = (userId) => `${USERS_URL}/${userId}/pokemon`;
export const ALL_WISHLIST_URL = (userId) =>
  `${USERS_URL}/${userId}/all-wishlist`;
export const ADD_TO_WISHLIST_URL = `${USERS_URL}/wishlist/add`;
export const REMOVE_FROM_WISHLIST_URL = `${USERS_URL}/wishlist/remove`;

// ------ POKEMON ENDPOINTS ------
export const POKEMON_URL = `${API_BASE_URL}/pokemons`;
export const TOGGLE_LOCKED_URL = (pokeId) =>
  `${POKEMON_URL}/${pokeId}/setLocked`;
export const ALL_ELIGIBLE_POKEMON = `${POKEMON_URL}/all-eligible-pokemon`;
export const SPECIFIC_ELIGIBLE_POKEMON_URL = (speciesId) =>
  `${POKEMON_URL}/eligible-pokemon/${speciesId}`;

// ------ INCUBATOR ENDPOINTS ------
export const INCUBATOR_URL = `${API_BASE_URL}/incubators`;
export const USERS_INCUBATORS = `${INCUBATOR_URL}/`;
export const CREATE_INCUBATOR_URL = (type) => `${INCUBATOR_URL}/${type}/create`;
export const DELETE_INCUBATOR_URL = (id) => `${INCUBATOR_URL}/${id}/cancel`;
export const HATCH_EGG_URL = (id) => `${INCUBATOR_URL}/${id}/hatch`;

// ----- SPEICES ENDPOINTS ------
export const SPEICES_URL = `${API_BASE_URL}/species`;
export const SPECIES_ALL_URL = `${SPEICES_URL}/`;
export const SPECIES_ITEM_URL = (dexNum) => `${SPEICES_URL}/item/${dexNum}`;

// ----- LISTING ENDPOINTS ------
export const LISTING_URL = `${API_BASE_URL}/listings`;
export const ALL_LISTING_URL = `${LISTING_URL}/`;
export const USERS_LISTINGS_URL = (userId, page) =>
  `${LISTING_URL}/?userId=${userId}&page=${page}`;
export const CREATE_LISTING_URL = `${LISTING_URL}/create`;
export const LISTING_DETAIL_URL = (listingId) => `${LISTING_URL}/${listingId}`;

// ----- OFFER ENDPOINTS ------
export const OFFER_URL = `${API_BASE_URL}/offers`;
export const CREATE_OFFER_URL = `${OFFER_URL}/create`;
export const OUTGOING_OFFERS_URL = `${OFFER_URL}/outgoing-offers`;
export const OFFER_ACCEPT_URL = (offerId) => `${OFFER_URL}/${offerId}/accept`;
export const OFFER_DECLINE_URL = (offerId) => `${OFFER_URL}/${offerId}/decline`;
export const INCOMING_OFFERS_URL = `${OFFER_URL}/incoming-offers`;
export const OFFER_WITHDRAW_URL = (offerId) =>
  `${OFFER_URL}/${offerId}/withdraw`;



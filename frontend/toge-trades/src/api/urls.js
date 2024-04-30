const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/v1`;

// ------ USERS ENDPOINTS ------
export const USERS_URL = `${API_BASE_URL}/users`;
export const REGISTER_ACCOUNT_URL = `${USERS_URL}/register`;
export const LOGIN_URL = `${USERS_URL}/login`;
export const ALL_USERS = `${USERS_URL}/`;
export const USER_BY_ID_URL = (userId) => `${USERS_URL}/${userId}`;
export const USER_POKEMON_URL = (userId) => `${USERS_URL}/${userId}/pokemon`;

export const POKEMON_URL = `${API_BASE_URL}/pokemons`;
export const TOGGLE_TRADEABLE_URL = (pokeId) =>
  `${POKEMON_URL}/${pokeId}/setTradeable`;


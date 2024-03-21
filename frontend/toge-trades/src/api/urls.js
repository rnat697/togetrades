const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/v1`;

export const USERS_URL = `${API_BASE_URL}/users`;

export const REGISTER_ACCOUNT_URL = `${USERS_URL}/register`;
export const LOGIN_URL = `${USERS_URL}/login`;

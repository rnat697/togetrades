import axios from "axios";
import { REGISTER_ACCOUNT_URL, LOGIN_URL, USERS_URL } from "./urls";

export const login = (username, password) =>
  axios.post(LOGIN_URL, { username, password }, { withCredentials: true });

export const signup = (email, username, password) =>
  axios.post(
    REGISTER_ACCOUNT_URL,
    { username, email, password },
    { withCredentials: true }
  );

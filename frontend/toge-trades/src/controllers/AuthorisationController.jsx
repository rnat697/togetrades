import { signupAPI, loginAPI } from "../api/api.js";

export function login(username, password) {
  return loginAPI(username, password).then((res) => {
    if (res.data.success) {
      return res.data.success;
    }
  });
}

export function signup(username, email, password) {
  return signupAPI(username, email, password).then((res) => {
    if (res.data.success) {
      return res.data.success;
    }
  });
}

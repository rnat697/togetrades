import React, { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

// context for storing auth info
const AuthContext = React.createContext(null);

// Checks wheter user is autheticated or not
export function useAuth() {
  const { token, setToken } = useContext(AuthContext);
  let isExpired, user;

  try {
    const decodeToken = jwtDecode(token);
    isExpired = isTokenExpired(decodeToken);
    user = {
      _id: decodeToken._id,
      username: decodeToken.username,
    };
    if (isExpired) setToken(null);
  } catch (error) {
    isExpired = true;
    user = null;
  }

  const isAuthenticated = !isExpired && user != null;

  return { token, setToken, user, isExpired, isAuthenticated };
}

// Wrapping app in provider to enable auth functionality
export function AuthContextProvider({ children }) {
  const [token, setToken] = useLocalStorage("authToken", null);
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// Wrapper to render other componets when authenticated otherwise redirect unautheticated users to /login
export function RequiresAuth({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return children;
  return <Navigate to={"/login"} />;
}

// Wrapper to render other components when NOT authenticated otherwise navigate to another path.
export function RequiresNonAuth({ navigatePathWhenAuth, children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return children;
  return <Navigate to={navigatePathWhenAuth || "/"} />;
}

// Checks if token has expired
// Returns true if the token is expired, false otherwise. If invalid token, returns null.
function isTokenExpired(decodedToken) {
  const dateNow = new Date();
  return new Date(decodedToken.exp * 1000) < dateNow;
}

export function extractAuthTokenFromCookie() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith("authorization=")) {
      return cookie.split("=")[1];
    }
  }
  return null; // Return null if the authorization cookie is not found
}

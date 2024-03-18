import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, extractAuthTokenFromCookie } from "../../api/auth.jsx";
import "./AuthorisationPage.css";
import AuthImage from "../../components/authorisation/auth-image/AuthImg";
import AuthContents from "../../components/authorisation/auth-contents/AuthContents";
import { signup, login } from "../../api/api.js";

export default function AuthorisationPage({ isLogin }) {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [showLogin, setShowLogin] = useState(isLogin);

  function handleSubmit(email, username, password) {
    if (!showLogin) {
      signup(username, email, password)
        .then((res) => {
          const token = extractAuthTokenFromCookie();
          setToken(token);
          navigate("/pokebox");
        })
        // TODO: Change to a Toast
        .catch((e) => console.log("Error when sign up! " + e));
    } else {
      console.log("Logging in");
      login(username, password)
        .then((res) => {
          const token = extractAuthTokenFromCookie();
          setToken(token);
          navigate("/pokebox");
        })
        // TODO: Change to a Toast
        .catch((e) => console.log("Error when loging in! " + e));
    }
  }

  const handleSwitch = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-content">
          <AuthContents
            isLogin={showLogin}
            handleSwitch={handleSwitch}
            onSubmit={handleSubmit}
          />
          <AuthImage showLogin={showLogin} />
        </div>
      </div>
      <div className="auth-background" />
    </div>
  );
}

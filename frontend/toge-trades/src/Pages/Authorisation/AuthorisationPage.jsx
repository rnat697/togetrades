import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, extractAuthTokenFromCookie } from "../../api/auth.jsx";
import "./AuthorisationPage.css";
import AuthImage from "../../components/authorisation/auth-image/AuthImg";
import AuthContents from "../../components/authorisation/auth-contents/AuthContents";
import { signup, login } from "../../api/api.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        .catch((e) => {
          console.log(e);
          toast("Error when signing up: " + e.response.data);
        });
    } else {
      console.log("Logging in");
      login(username, password)
        .then((res) => {
          const token = extractAuthTokenFromCookie();
          setToken(token);
          navigate("/pokebox");
        })
        .catch((e) => toast("Error when logging in: " + e.response.data));
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
          <ToastContainer />
        </div>
      </div>
      <div className="auth-background" />
    </div>
  );
}

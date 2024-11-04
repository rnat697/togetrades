import "./AuthorisationPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthImage from "../../components/authorisation/auth-image/AuthImg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login, signup } from "../../controllers/AuthorisationController.jsx";
import { useAuth, extractAuthTokenFromCookie } from "../../api/auth.jsx";
import Logo from "../../components/logo/Logo";
import Divider from "../../components/authorisation/divder/Divider";
import { Link } from "react-router-dom";

export default function AuthorisationPage({ isLogin }) {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [showLogin, setShowLogin] = useState(isLogin);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to clear input values
  const clearInputs = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  // Clear inputs when switching between login and signup screens
  useEffect(() => {
    clearInputs();
  }, [showLogin]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!showLogin) {
      // --- API call ---
      signup(username, email, password)
        .then((res) => {
          const token = extractAuthTokenFromCookie();
          setToken(token);
          navigate("/pokebox");
        })
        .catch((e) => {
          toast("Error when signing up: " + e.response.data);
        });
    } else {
      // --- Login api call ---
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
          <div
            className={`content-container ${
              showLogin ? "login-screen" : "signup-screen"
            }`}
          >
            <div className="contents-auth">
              <div className="auth-heading">
                <Logo />
                <h1 className="title">{showLogin ? "Login" : "Sign up"}</h1>
              </div>
              <div className="auth-forms">
                <form onSubmit={handleSubmit}>
                  <div
                    className={`input-container ${
                      showLogin ? "login-form" : "signup-form"
                    }`}
                    aria-label="email-input-container"
                  >
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required={!showLogin}
                    />
                  </div>
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-container">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit">
                    {showLogin ? "Login" : "Sign up"}
                  </button>
                </form>
                <Divider />
                <p className="subtitle">
                  {showLogin
                    ? "Not registered yet? "
                    : "Already have an account? "}
                  <Link className="auth-link" onClick={handleSwitch}>
                    {showLogin ? "Sign up" : "Login"}
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <AuthImage showLogin={showLogin} />
          <ToastContainer />
        </div>
      </div>
      <div className="auth-background" />
    </div>
  );
}

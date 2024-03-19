import Logo from "../../logo/Logo";
import Divider from "../divder/Divider";
import "./AuthContents.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AuthContents({ isLogin, handleSwitch, onSubmit }) {
  // State to manage input values
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(email, username, password);
  }

  // Function to clear input values
  const clearInputs = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  // Clear inputs when switching between login and signup screens
  useEffect(() => {
    clearInputs();
  }, [isLogin]);

  return (
    <div
      className={`content-container ${
        isLogin ? "login-screen" : "signup-screen"
      }`}
    >
      <div className="contents-auth">
        <div className="auth-heading">
          <Logo />
          <h1 className="title">{isLogin ? "Login" : "Sign up"}</h1>
        </div>
        <div className="auth-forms">
          <form onSubmit={handleSubmit}>
            <div
              className={`input-container ${
                isLogin ? "login-form" : "signup-form"
              }`}
              aria-label="email-input-container"
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!isLogin}
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
            <button type="submit">{isLogin ? "Login" : "Sign up"}</button>
          </form>
          <Divider />
          <p className="subtitle">
            {isLogin ? "Not registered yet? " : "Already have an account? "}
            <Link className="auth-link" onClick={handleSwitch}>
              {isLogin ? "Sign up" : "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

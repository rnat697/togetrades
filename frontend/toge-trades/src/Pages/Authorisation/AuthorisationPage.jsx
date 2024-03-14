import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthorisationPage.css";
import AuthImage from "../../components/authorisation/auth-image/AuthImg";
import AuthContents from "../../components/authorisation/auth-contents/AuthContents";

export default function AuthorisationPage({ isLogin }) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(isLogin);
  const handleSwitch = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-content">
          <AuthContents isLogin={showLogin} handleSwitch={handleSwitch} />
          <AuthImage showLogin={showLogin} />
        </div>
      </div>
      <div className="auth-background" />
    </div>
  );
}

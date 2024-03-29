import { useNavigate } from "react-router-dom";
import LandingHeader from "../../components/landing/landing-header/LandingHeader";
import "./LandingPage.css";
import LandingBackground from "../../components/landing/landing-background/LandingBackground";
import LandingImage from "../../components/landing/landing-image/LandingImage";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <LandingHeader />
      <div className="content">
        <div className="text-content">
          <h1 className="headline">Gotta Hatch 'Em All!</h1>
          <p className="subtitle">
            Hatch eggs and trade Pokemon to complete your Pokedex.
          </p>
          <div className="button-horizontal">
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Sign up
            </button>
          </div>
        </div>
        <LandingImage />
      </div>
      <LandingBackground />
    </div>
  );
}

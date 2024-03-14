import { NavLink } from "react-router-dom";
import './LandingHeader.css';
import Logo from "../../logo/Logo";

export default function LandingHeader() {
  return (
    <div className="header">
      <header className="landing-header">
        <Logo />
      </header>
    </div>
  );
}
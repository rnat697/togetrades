import { NavLink } from "react-router-dom";
import './LandingHeader.css';

export default function LandingHeader() {

    return (
        <div className='header'>
            <header className="landing-header">
                <img className='logo' src='../src/assets/logo.png' />
                <h1 className='brand-name'>Toge Trades</h1>
            </header>
        </div>
    );
}
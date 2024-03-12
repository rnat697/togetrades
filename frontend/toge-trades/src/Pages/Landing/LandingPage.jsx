import { useContext } from 'react';
import { AppContext } from '../../AppContextProvider';
import LandingHeader from '../../components/landing/landing-header/LandingHeader';
import './LandingPage.css';
import LandingBackground from '../../components/landing/landing-background/LandingBackground';

export default function LandingPage() {

    return (
        <div className='landing-page'>
            <LandingHeader />
            <div className='content'>
                <h1 className='headline'>Gotta Hatch 'Em All!</h1>
                <b className='subtitle'>Hatch eggs and trade Pokemon to complete your Pokedex.</b>
            </div>
            <LandingBackground />
        </div>
    );
}
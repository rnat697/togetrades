import { useContext } from 'react';
import { AppContext } from '../../AppContextProvider';

export default function LandingPage() {

    return (
        <div className='landing-page'>
            <h3 className='brandName'> Toge Trades</h3>
            <h1 className='headline'>Gotta Hatch 'Em All!</h1>
            <b className='subtitle'>Hatch eggs and trade Pokemon to complete your Pokedex.</b>
        </div>
    );
}
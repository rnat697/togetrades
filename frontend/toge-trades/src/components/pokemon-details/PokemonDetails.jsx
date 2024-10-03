import "./PokemonDetails.css";
import { IoIosClose } from "react-icons/io";
import { useEffect, useState } from "react";

import {
  capitalizeFirstLetter,
  convertDecimeterToMeters,
  convertHectogramToKilogram,
} from "../utils/utils";
import PokemonType from "../pokemon-type/PokemonType";
import InfoTag from "../info-tag/InfoTag";
import LockButton from "../lock/LockButton";
import TradeableButton from "../tradeable/TradeableButton";
import RareIndicators from "../rare-indicators/RareIndicators";

export default function PokemonDetails({ pokemon, onClose, modalType }) {
  if (!pokemon) return null;

  return (
    <div className={`pokedetails-container ${modalType}`}>
      <div
        data-testid="details-close"
        className="details-buttons"
        onClick={() => onClose()}
      >
        <IoIosClose color="#212A4A" size={"3em"} />
      </div>
      <div className="poke-btn-fav-trade"></div>
      <RareIndicators pokemon={pokemon} />
      <img
        className="pokeimg"
        src={
          pokemon.isShiny
            ? pokemon.species.image.shiny
            : pokemon.species.image.normal
        }
      />
      <h1>{capitalizeFirstLetter(pokemon.species.name)}</h1>
      <div className="poke-type">
        {pokemon.species.types.map((type, index) => (
          <PokemonType key={index + type} type={type} />
        ))}
      </div>
      <div className="info-tags">
        <InfoTag
          title={"Height"}
          subtitle={
            convertDecimeterToMeters(pokemon.species.height).toString() + "m"
          }
        />
        <InfoTag
          title={"Weight"}
          subtitle={
            convertHectogramToKilogram(pokemon.species.weight).toString() + "kg"
          }
        />
      </div>
      <div className="poke-entry">
        <h2> Pokedex Entry</h2>
        <p>{pokemon.species.dexEntry}</p>
        <h3>Original Trainer</h3>
        <p>{pokemon.originalOwner.username}</p>
      </div>
    </div>
  );
}

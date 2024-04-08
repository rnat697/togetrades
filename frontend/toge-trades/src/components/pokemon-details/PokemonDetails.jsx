import "./PokemonDetails.css";
import { IoIosClose } from "react-icons/io";
import { useState } from "react";

import { capitalizeFirstLetter } from "../utils/utils";
import PokemonType from "../pokemon-type/PokemonType";
import InfoTag from "../info-tag/InfoTag";

export default function PokemonDetails({ pokemon, onClose }) {
  if (!pokemon) return null;

  return (
    <div className="pokedetails-container">
      <div className="details-close" onClick={() => onClose()}>
        <IoIosClose color="#212A4A" size={"3em"} />
      </div>
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
          subtitle={pokemon.species.height.toString()}
        />
        <InfoTag
          title={"Weight"}
          subtitle={pokemon.species.weight.toString()}
        />
      </div>
    </div>
  );
}

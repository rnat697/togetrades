import Species from "./species-schema.js";
import User from "./user-schema.js";

/**
 * Gets species by a filter. Ideally used for finding species of specific types
 * and/or rarity (legendary or not)
 *
 * @param {*} filter the filter applied
 * @returns the list of matching species (an empty array if no matches)
 */
export function getSpeciesByFilter(filter) {
  return Species.find(filter);
}

export function getRandomSpeciesFromList(speciesList) {
  const randomIndex = Math.floor(Math.random() * speciesList.length);
  return pokemonList[randomIndex];
}

import Incubator from "./incubator-schema";

/**
 * Gets incubators for the given user
 *
 * @param {*} userId the user whose incubators to fetch
 * @returns the list of matching incubators (an empty array if no matches)
 */
export function retrieveIncubatorsForUser(userID) {
  return Incubator.find({ hatcher: userID });
}

export function isLegendaryEggProbability() {
  const probabilities = {
    common: 0.7,
    legendary: 0.08,
  };

  const random = Math.random();

  if (random < probabilities.legendary) {
    return true;
  }

  return false;
}

export function isValidPokemonType(type) {
  const validPokemonTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];
  return validPokemonTypes.includes(type.toLowercase());
}

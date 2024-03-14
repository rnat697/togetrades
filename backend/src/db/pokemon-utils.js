import Pokemon from "./pokemon-schema.js";
import Species from "./species-schema.js";

const NUM_STARTER_POKEMON = 12;

/**
 * Generates 12 random pokemon for a given user. This is usually called in `/register`.
 * @param {*} ownerId the id of the user
 * @param {*} numPoke the number of pokemon to create
 *  */
export async function generateStartingPokemonForUser(
  ownerId,
  numPokemon = NUM_STARTER_POKEMON
) {
  const promises = [];
  for (let i = 0; i < numPokemon; i++) {
    promises.push(createRandomPokemon(ownerId, 0.6));
  }
  await Promise.all(promises);
}

/**
 * Generates a random pokemon
 * @param {*} ownerId the id of the user
 * @param {*} shinyChance probability of getting a shiny
 * @returns a pokemon
 *  */
export async function createRandomPokemon(ownerId, shinyChance = 0.6) {
  const allSpecies = await Species.find({});
  const index = Math.floor(Math.random() * allSpecies.length);
  return await createPokemon(ownerId, allSpecies[index]._id, shinyChance);
}

/**
 * Creates a single pokemon of the given species
 *
 * @param {*} ownerId the owner's id
 * @param {*} speciesId the species' id
 * @param {*} shinyChance the chance to be shiny
 * @returns the pokemon
 */
export async function createPokemon(ownerId, speciesId, shinyChance = 0.6) {
  const isShiny = Math.random() <= shinyChance;

  const species = await Species.findById(speciesId);
  if (!species) throw "Invalid species id";

  const pokemon = await Pokemon.create({
    species: speciesId,
    nickname: species.name,
    isShiny,
    currentOwner: ownerId,
    originalOwner: ownerId,
  });

  return pokemon;
}

/**
 * Gets a single pokemon
 *
 * @param {*} id the id of the pokemon to retrieve
 * @returns the pokemon with its "species" data populated, or null if not found
 */
export function retrievePokemonById(id) {
  return Pokemon.findById(id).populate("species");
}

/**
 * Gets pokemon for the given user
 *
 * @param {*} ownerId the user whose pokemon to fetch
 * @returns the list of matching pokemon (an empty array if no matches)
 */
export function retrievePokemonForUser(ownerId) {
  return Pokemon.find({ owner: ownerId }).populate("species");
}

/**
 * Updates the favourites field for a user's pokemon (can be used to favourite it or unfavourite)
 * @param {*} pokeID The id of the pokemon to update
 * @returns the updated pokemon
 */
export async function updateFavUserPokemon(isFavouriteUpdates, pokeID) {
  return Pokemon.findByIdAndUpdate(pokeID, isFavouriteUpdates, { new: true });
}

/**
 * Updates the tradeable field for a user's pokemon (can be used to favourite it or unfavourite)
 * @param {*} pokeID The id of the pokemon to update
 * @returns the updated pokemon
 */
export async function updateTradeableUserPokemon(isTradeableUpdates, pokeID) {
  return Pokemon.findByIdAndUpdate(pokeID, isTradeableUpdates, { new: true });
}

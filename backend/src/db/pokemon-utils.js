import Pokemon from "./pokemon-schema.js";
import Species from "./species-schema.js";
import User from "./user-schema.js";

const NUM_STARTER_POKEMON = 20;

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
    const pokemon = await createRandomPokemon(ownerId, 0.06);
    promises.push(pokemon);
    // Sets User's image with the first pokemon they have.
    if (i == 0) {
      await pokemon.populate("species");
      await updateUserImage(ownerId, pokemon.species.image.normal);
    }
  }
  await Promise.all(promises);
}

/**
 * updates User's image
 */
async function updateUserImage(userID, imageURL) {
  try {
    const user = await User.findById(userID);
    if (!user) throw new Error("User not found");
    user.image = imageURL;
    await user.save();
  } catch (error) {
    console.error("Error updating user image: ", error.message);
    throw error;
  }
}

/**
 * Generates a random pokemon
 * @param {*} ownerId the id of the user
 * @param {*} shinyChance probability of getting a shiny
 * @returns a pokemon
 *  */
export async function createRandomPokemon(ownerId, shinyChance = 0.06) {
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
export async function createPokemon(ownerId, speciesId, shinyChance = 0.06) {
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
  return Pokemon.findById(id).populate([
    { path: "species" },
    {
      path: "originalOwner",
      select: "username _id",
    },
    {
      path: "currentOwner",
      select: "username _id",
    },
  ]);
}

/**
 * Gets pokemon for the given user
 *
 * @param {*} ownerId the user whose pokemon to fetch
 * @returns the list of matching pokemon (an empty array if no matches)
 */
export function retrievePokemonForUser(ownerId) {
  return Pokemon.find({ currentOwner: ownerId }).populate([
    { path: "species" },
    {
      path: "originalOwner",
      select: "username _id",
    },
    {
      path: "currentOwner",
      select: "username _id",
    },
  ]);
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
 * Updates the locked field for a user's pokemon (can be used to lock it or unlock it)
 * @param {*} pokeID The id of the pokemon to update
 * @returns the updated pokemon
 */
export async function updateLockedPokemon(isLockedUpdates, pokeID) {
  return Pokemon.findByIdAndUpdate(pokeID, isLockedUpdates, { new: true });
}

/**
 * Finds how many tradeable pokemon the user has currently.
 * @param {*} ownerID The id of the pokemon to update
 * @returns the number of tradeable pokemon a user has currently
 * @deprecated
 */
export async function calculateNumTradeable(ownerID) {
  return Pokemon.countDocuments({ currentOwner: ownerID, isTradeable: true });
}
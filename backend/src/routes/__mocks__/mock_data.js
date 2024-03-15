import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken";

// --------- Species ---------

const speciesIvysaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000020"),
  dexNumber: 2,
  dexEntry:
    "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.",
  name: "ivysaur",
  types: ["grass", "poison"],
  height: 10,
  weight: 130,
  isLegendary: false,
  image: {
    normal:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
    shiny:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/2.png",
  },
};

const speciesLunala = {
  _id: new mongoose.Types.ObjectId("000000000000000000000792"),
  dexNumber: 792,
  dexEntry:
    "It is said to be a female evolution of Cosmog. When its third eye activates, away it flies to another world.",
  name: "lunala",
  types: ["psychic", "ghost"],
  height: 40,
  weight: 1200,
  isLegendary: true,
  image: {
    normal:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png",
    shiny:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/792.png",
  },
};

// --------- Users ---------
// password = passwordowo
const userLynney = {
  _id: new mongoose.Types.ObjectId("000000000000000000000001"),
  username: "Lynney",
  email: "lynney@email.com",
  passHash: "$2a$12$JFOo59MradqgZHSeRvJG..BqLJzYQWSkWcgsGg2oOzXaVxTLwac/a",
};

// Valid token for Lynney - for authetication checks
const tokenLynney = jwt.sign(
  { _id: "000000000000000000000001", username: "Lynney" },
  process.env.JWT_KEY,
  { expiresIn: "7d" }
);
const bearerLynney = `Bearer ${tokenLynney}`;

// --------- Pokemon ---------
// Lynney's Ivysaur
const pokemonLynneysIvyasaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000005"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000001"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000001"),
  isShiny: true,
  isTradeable: false,
  isFavourite: false,
};

// --------- Functions ---------
async function addMockSpecies() {
  const speciesDB = mongoose.connection.db.collection("species");
  await speciesDB.insertMany([speciesIvysaur, speciesLunala]);
}
async function addMockUsers() {
  const usersDB = mongoose.connection.db.collection("users");
  await usersDB.insertOne(userLynney);
  // await usersDB.insertMany([userLynney.]);
}
async function addMockPokemons() {
  const pokemonsDB = mongoose.connection.db.collection("pokemons");
  await pokemonsDB.insertOne(pokemonLynneysIvyasaur);
  // await usersDB.insertMany([pokemonLynneysIvyasaur,]);
}

async function dropData() {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}

async function addAllMockData() {
  await dropData();
  await addMockSpecies();
  await addMockUsers();
  await addMockPokemons();
}

export {
  speciesIvysaur,
  speciesLunala,
  bearerLynney,
  pokemonLynneysIvyasaur,
  addAllMockData,
};

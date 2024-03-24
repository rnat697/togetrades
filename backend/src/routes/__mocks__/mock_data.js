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
// https://bcrypt-generator.com/
// password = password12345
// Lynney
const userLynney = {
  _id: new mongoose.Types.ObjectId("000000000000000000000001"),
  username: "Lynney",
  email: "lynney@email.com",
  passHash: "$2a$12$GUoBELgxZwgU2MwhZQDVresoxBzaSOTZTat157F0KaHjoBGEI3yKO",
  image:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png",
};

// Valid token for Lynney - for authetication checks
const tokenLynney = jwt.sign(
  { _id: "000000000000000000000001", username: "Lynney" },
  process.env.JWT_KEY,
  { expiresIn: "7d" }
);
const bearerLynney = `Bearer ${tokenLynney}`;

// Navia
const userNavia = {
  _id: new mongoose.Types.ObjectId("000000000000000000000002"),
  username: "Navia",
  email: "navia@email.com",
  passHash: "$2a$12$GUoBELgxZwgU2MwhZQDVresoxBzaSOTZTat157F0KaHjoBGEI3yKO",
  image:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png",
};

// Valid token for Navia - for authetication checks
const tokenNavia = jwt.sign(
  { _id: "000000000000000000000002", username: "Navia" },
  process.env.JWT_KEY,
  { expiresIn: "7d" }
);
const bearerNavia = `Bearer ${tokenNavia}`;

// Navia
const userVenti = {
  _id: new mongoose.Types.ObjectId("000000000000000000000003"),
  username: "Venti",
  email: "venti@email.com",
  passHash: "$2a$12$GUoBELgxZwgU2MwhZQDVresoxBzaSOTZTat157F0KaHjoBGEI3yKO",
  image:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png",
};

// Valid token for Navia - for authetication checks
const tokenVenti = jwt.sign(
  { _id: "000000000000000000000003", username: "Venti" },
  process.env.JWT_KEY,
  { expiresIn: "7d" }
);
const bearerVenti = `Bearer ${tokenVenti}`;

// --------- Pokemon ---------
// Lynney's Ivysaur
const pokemonLynneysIvyasaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000075"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000001"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000001"),
  isShiny: true,
  isTradeable: false,
  isFavorite: false,
};
// Navia's Lunala
const pokemonNaviasLunala = {
  _id: new mongoose.Types.ObjectId("000000000000000000000076"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: false,
  isTradeable: false,
  isFavorite: true,
};
// Navia's ivysaur
const pokemonNaviasIvysaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000077"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: true,
  isTradeable: true,
  isFavorite: false,
};
// Venti's IvySaur
const pokemonVentisIvyasaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000078"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000003"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000003"),
  isShiny: true,
  isTradeable: true,
  isFavorite: false,
};
// --------- Functions ---------
async function addMockSpecies() {
  const speciesDB = mongoose.connection.db.collection("species");
  await speciesDB.insertMany([speciesIvysaur, speciesLunala]);
}
async function addMockUsers() {
  const usersDB = mongoose.connection.db.collection("users");
  await usersDB.insertMany([userLynney, userNavia, userVenti]);
}
async function addMockPokemons() {
  const pokemonsDB = mongoose.connection.db.collection("pokemons");
  await pokemonsDB.insertMany([pokemonLynneysIvyasaur, pokemonNaviasLunala,pokemonNaviasIvysaur, pokemonVentisIvyasaur]);
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
  userLynney,
  userNavia,
  userVenti,
  bearerLynney,
  bearerNavia,
  bearerVenti,
  pokemonLynneysIvyasaur,
  pokemonNaviasLunala,
  pokemonNaviasIvysaur,
  pokemonVentisIvyasaur,
  addAllMockData,
};

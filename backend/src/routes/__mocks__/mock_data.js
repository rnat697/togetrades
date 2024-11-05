import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken";

// --------- Species ---------
const speciesShaymin = {
  _id: new mongoose.Types.ObjectId("000000000000000000000492"),
  dexNumber: 492,
  dexEntry:
    "It lives in flower patches and avoids detection by curling up to look like a flowering plant.",
  name: "shaymin",
  types: ["grass"],
  height: 2,
  weight: 21,
  isLegendary: true,
  image: {
    normal:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/492.png",
    shiny:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/492.png",
  },
};

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

// Venti
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

// Agatha
const userAgatha = {
  _id: new mongoose.Types.ObjectId("000000000000000000000756"),
  username: "Agatha",
  email: "Agatha@email.com",
  passHash: "$2a$12$GUoBELgxZwgU2MwhZQDVresoxBzaSOTZTat157F0KaHjoBGEI3yKO",
  image:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png",
};

// Valid token for Agatha - for authetication checks
const tokenAgatha = jwt.sign(
  { _id: "000000000000000000000756", username: "Agatha" },
  process.env.JWT_KEY,
  { expiresIn: "7d" }
);
const bearerAgatha = `Bearer ${tokenAgatha}`;

// --------- Pokemon ---------
// Lynney's Ivysaur
const pokemonLynneysIvyasaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000075"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000001"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000001"),
  isShiny: true,
  isTrading: false,
  isLocked: true,
};
// Navia's Lunala
const pokemonNaviasLunala = {
  _id: new mongoose.Types.ObjectId("000000000000000000000076"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: false,
  isTrading: false,
  isLocked: false,
};
// Navia's ivysaur
const pokemonNaviasIvysaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000077"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: true,
  isTrading: true,
  isLocked: false,
};
// Navia's Lunala
const pokemonNaviasLunalaDup1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000079"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: false,
  isTrading: true,
  isLocked: false,
};
// Navia's ivysaur
const pokemonNaviasIvysaurDupe1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000080"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: true,
  isTrading: true,
  isLocked: false,
};
const pokemonNaviasLunalaDup2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000081"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: false,
  isTrading: true,
  isLocked: false,
};
// Navia's ivysaur
const pokemonNaviasIvysaurDupe2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000082"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: true,
  isTrading: true,
  isLocked: false,
};

// Navia's ivysaur
const pokemonNaviasIvysaurDupe3 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000083"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: true,
  isTrading: true,
  isLocked: false,
};

// Venti's IvySaur
const pokemonVentisIvyasaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000078"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000003"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000003"),
  isShiny: true,
  isTrading: false,
  isLocked: false,
};
// Venti's Lunala
const pokemonVentisLunala = {
  _id: new mongoose.Types.ObjectId("000000000000000000000843"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000003"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000003"),
  isShiny: false,
  isTrading: true,
  isLocked: false,
};

let pokemonAgathasLunala = {
  _id: new mongoose.Types.ObjectId("000000000000000000000514"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000756"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000756"),
  isShiny: false,
  isTrading: true,
  isLocked: false,
}



function makeAgathasPokemons(){
  let pokemonList = [];
  // Get the original ID as a number
  let baseId = parseInt(pokemonAgathasLunala._id.toString(), 16); // Convert ObjectId to base 10 integer

  for (let i = 0; i < 50; i++) {
    // Increment the base ID
    let newId = (baseId + i).toString(16).padStart(24, '0'); // Convert back to hex, ensure it's 24 characters

    let newPokemon = {
      ...pokemonAgathasLunala,
      _id: new mongoose.Types.ObjectId(newId)
    };

    pokemonList.push(newPokemon);
  }
  return pokemonList;
}

// --------- Incubators ---------
// Venti's incubators can be useful for not allowing
// adding incubators when there are already 4 active.
const ventisIncubatorGhost = {
  _id: new mongoose.Types.ObjectId("000000000000000000003562"),
  hatcher: new mongoose.Types.ObjectId("000000000000000000000003"),
  // 1716069600 = Sun May 19 2024 10:00:00 GMT+1200 (New Zealand Standard Time)
  hatchTime: new Date(1716069600),
  hatched: false,
  isLegendary: true,
  pokemonType: "ghost",
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
};
const ventisIncubatorGrass = {
  _id: new mongoose.Types.ObjectId("000000000000000000003563"),
  hatcher: new mongoose.Types.ObjectId("000000000000000000000003"),
  hatchTime: new Date(),
  hatched: false,
  isLegendary: false,
  pokemonType: "grass",
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
};

const ventisIncubatorGrassDupe1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000003564"),
  hatcher: new mongoose.Types.ObjectId("000000000000000000000003"),
  hatchTime: new Date(),
  hatched: false,
  isLegendary: false,
  pokemonType: "grass",
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
};

const ventisIncubatorGrassDupe2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000003565"),
  hatcher: new mongoose.Types.ObjectId("000000000000000000000003"),
  hatchTime: new Date(),
  hatched: false,
  isLegendary: false,
  pokemonType: "grass",
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
};

// --------- Functions ---------
async function addMockSpecies() {
  const speciesDB = mongoose.connection.db.collection("species");
  await speciesDB.insertMany([speciesShaymin, speciesIvysaur, speciesLunala]);
}
async function addMockUsers() {
  const usersDB = mongoose.connection.db.collection("users");
  await usersDB.insertMany([userLynney, userNavia, userVenti, userAgatha]);
}
async function addMockPokemons() {
  const pokemonsDB = mongoose.connection.db.collection("pokemons");
  let agathaList = makeAgathasPokemons();
  await pokemonsDB.insertMany([
    pokemonLynneysIvyasaur,
    pokemonNaviasLunala,
    pokemonNaviasIvysaur,
    pokemonNaviasLunalaDup1,
    pokemonNaviasLunalaDup2,
    pokemonNaviasIvysaurDupe1,
    pokemonNaviasIvysaurDupe2,
    pokemonNaviasIvysaurDupe3,
    pokemonVentisIvyasaur,
    pokemonVentisLunala,
  ]);
  await pokemonsDB.insertMany(agathaList);
}

async function addMockIncubators() {
  let incubatorDB = mongoose.connection.db.collection("incubators");
  ventisIncubatorGrass.hatchTime.setHours(
    ventisIncubatorGrass.hatchTime.getHours() + 3
  );
  ventisIncubatorGrassDupe1.hatchTime.setHours(
    ventisIncubatorGrass.hatchTime.getHours() + 3
  );
  ventisIncubatorGrassDupe2.hatchTime.setHours(
    ventisIncubatorGrass.hatchTime.getHours() + 3
  );
  await incubatorDB.insertMany([
    ventisIncubatorGhost,
    ventisIncubatorGrass,
    ventisIncubatorGrassDupe1,
    ventisIncubatorGrassDupe2,
  ]);
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
  await addMockIncubators();
}

export {
  speciesIvysaur,
  speciesLunala,
  speciesShaymin,
  userLynney,
  userNavia,
  userVenti,
  userAgatha,
  bearerLynney,
  bearerNavia,
  bearerVenti,
  bearerAgatha,
  pokemonLynneysIvyasaur,
  pokemonNaviasLunala,
  pokemonNaviasIvysaur,
  pokemonVentisIvyasaur,
  pokemonVentisLunala,
  pokemonAgathasLunala,
  ventisIncubatorGhost,
  ventisIncubatorGrass,
  addAllMockData,
};

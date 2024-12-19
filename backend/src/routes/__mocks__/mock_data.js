import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken";
import Pokemon from "../../db/pokemon-schema";
import Species from "../../db/species-schema";

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
const speciesOddish = {
  _id: new mongoose.Types.ObjectId("65f306233a6aae800ca98330"),
  dexNumber: 43,
  dexEntry:
    "During the day, it keeps its face buried in the ground. At night, it wanders around sowing its seeds.",
  name: "oddish",
  types: ["grass", "poison"],
  height: 5,
  weight: 54,
  isLegendary: false,
  image: {
    normal:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/43.png",
    shiny:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/43.png",
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
const speciesBulbasaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000029"),
  dexNumber: 1,
  dexEntry:
    "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.",
  name: "bulbasaur",
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
const speciesVenusaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000028"),
  dexNumber: 3,
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
  wishlist: [
    {
      species: speciesBulbasaur._id,
      _id: new mongoose.Types.ObjectId("000000000000710000000001"),
    },
    {
      species: speciesLunala._id,
      _id: new mongoose.Types.ObjectId("000000000000720000000001"),
    },
    {
      species: speciesVenusaur._id,
      _id: new mongoose.Types.ObjectId("000000000000730000000001"),
    },
  ],
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
  wishlist: [
    {
      species: speciesBulbasaur._id,
      _id: new mongoose.Types.ObjectId("000000000000710000000001"),
    },
  ],
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
  wishlist: [
    {
      species: speciesBulbasaur._id,
      _id: new mongoose.Types.ObjectId("000000000000740000000001"),
    },
  ],
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
  wishlist: [
    {
      species: speciesBulbasaur._id,
      _id: new mongoose.Types.ObjectId("000000000000810000000001"),
    },
    {
      species: speciesShaymin._id,
      _id: new mongoose.Types.ObjectId("000000000000820000000001"),
    },
    {
      species: speciesVenusaur._id,
      _id: new mongoose.Types.ObjectId("000000000000830000000001"),
    },
  ],
};

// Furina
const userFurina = {
  _id: new mongoose.Types.ObjectId("000000000000000000000759"),
  username: "Furina",
  email: "furina@email.com",
  passHash: "$2a$12$GUoBELgxZwgU2MwhZQDVresoxBzaSOTZTat157F0KaHjoBGEI3yKO",
  image:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png",
  wishlist: [],
};

// Valid token for Furina - for authetication checks
const tokenFurina = jwt.sign(
  { _id: userFurina._id, username: userFurina.username },
  process.env.JWT_KEY,
  { expiresIn: "7d" }
);
const bearerFurina = `Bearer ${tokenFurina}`;

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
  hasBeenTraded: false,
};
// Navia's Lunala
const pokemonNaviasLunala = {
  _id: new mongoose.Types.ObjectId("000000000000000000000076"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000001"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: false,
  isTrading: false,
  isLocked: false,
  hasBeenTraded: true,
};
// Navia's ivysaur
const pokemonNaviasIvysaur = {
  _id: new mongoose.Types.ObjectId("000000000000000000000077"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: true,
  isTrading: false,
  isLocked: true,
  hasBeenTraded: false,
};
// Navia's Lunala
const pokemonNaviasLunalaDup1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000079"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: false,
  isTrading: false,
  isLocked: false,
  hasBeenTraded: false,
};
// Navia's ivysaur
const pokemonNaviasIvysaurDupe1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000080"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: true,
  isTrading: false,
  isLocked: false,
  hasBeenTraded: false,
};
const pokemonNaviasLunalaDup2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000081"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: false,
  isTrading: false,
  isLocked: false,
  hasBeenTraded: false,
};
// Navia's ivysaur
const pokemonNaviasIvysaurDupe2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000082"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: true,
  isTrading: false,
  isLocked: false,
  hasBeenTraded: false,
};

// Navia's ivysaur
const pokemonNaviasIvysaurDupe3 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000083"),
  species: new mongoose.Types.ObjectId("000000000000000000000020"),
  orignialOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000002"),
  isShiny: true,
  isTrading: false,
  isLocked: false,
  hasBeenTraded: false,
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
  hasBeenTraded: false,
};
// Venti's Lunala
const pokemonVentisLunala = {
  _id: new mongoose.Types.ObjectId("000000000000000000000843"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  originalOwner: new mongoose.Types.ObjectId("000000000000000000000003"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000003"),
  isShiny: false,
  isTrading: true,
  isLocked: false,
  hasBeenTraded: false,
};
const pokemonVentisLunalaTradeable = {
  _id: new mongoose.Types.ObjectId("000000000000000000000845"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  originalOwner: new mongoose.Types.ObjectId("000000000000000000000003"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000003"),
  isShiny: false,
  isTrading: false,
  isLocked: false,
  hasBeenTraded: false,
};
const pokemonFurinaBulbasaur1 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000145"),
  species: speciesBulbasaur._id,
  originalOwner: userFurina._id,
  currentOwner: userFurina._id,
  isShiny: false,
  isTrading: false,
  isLocked: false,
  hasBeenTraded: false,
};
const pokemonFurinaBulbasaur2 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000146"),
  species: new mongoose.Types.ObjectId("000000000000000000000029"),
  originalOwner: userFurina._id,
  currentOwner: userFurina._id,
  isShiny: false,
  isTrading: true,
  isLocked: false,
  hasBeenTraded: false,
};
const pokemonFurinaBulbasaur3 = {
  _id: new mongoose.Types.ObjectId("000000000000000000000147"),
  species: new mongoose.Types.ObjectId("000000000000000000000029"),
  originalOwner: userFurina._id,
  currentOwner: userFurina._id,
  isShiny: false,
  isTrading: true,
  isLocked: false,
  hasBeenTraded: false,
};
const pokemonFurinaLunala = {
  _id: new mongoose.Types.ObjectId("000000000000000000000148"),
  species: new mongoose.Types.ObjectId(speciesLunala._id),
  originalOwner: userFurina._id,
  currentOwner: userFurina._id,
  isShiny: false,
  isTrading: true,
  isLocked: false,
  hasBeenTraded: false,
};

let pokemonAgathasLunala = {
  _id: new mongoose.Types.ObjectId("000000000000000000000514"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  originalOwner: new mongoose.Types.ObjectId("000000000000000000000756"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000756"),
  isShiny: false,
  isTrading: false,
  isLocked: false,
  hasBeenTraded: false,
};

let pokemonAgathasLockedLunala = {
  _id: new mongoose.Types.ObjectId("000000000000000000000684"),
  species: new mongoose.Types.ObjectId("000000000000000000000792"),
  originalOwner: new mongoose.Types.ObjectId("000000000000000000000756"),
  currentOwner: new mongoose.Types.ObjectId("000000000000000000000756"),
  isShiny: false,
  isTrading: false,
  isLocked: true,
  hasBeenTraded: false,
};

function makeAgathasPokemons() {
  let pokemonList = [];
  // Get the original ID as a number
  let baseId = parseInt(pokemonAgathasLunala._id.toString(), 16); // Convert ObjectId to base 10 integer

  for (let i = 0; i < 50; i++) {
    // Increment the base ID
    let newId = (baseId + i).toString(16).padStart(24, "0"); // Convert back to hex, ensure it's 24 characters

    let newPokemon = {
      ...pokemonAgathasLunala,
      _id: new mongoose.Types.ObjectId(newId),
    };

    pokemonList.push(newPokemon);
  }
  return pokemonList;
}

function makeAgathasListings() {
  let listings = [];
  let originalDate = new Date();
  let totalOffsetMinutes = 30;
  let intervalMilliseconds = (totalOffsetMinutes * 60 * 1000) / 29;
  // Get the original ID as a number
  let baseId = parseInt(pokemonAgathasLunala._id.toString(), 16); // Convert ObjectId to base 10 integer
  let listingBaseId = parseInt("000000000000000000003868", 16);

  for (let i = 0; i < 30; i++) {
    // Increment the base ID
    let newId = (baseId + i).toString(16).padStart(24, "0"); // Convert back to hex, ensure it's 24 characters
    let newListingId = (listingBaseId + i).toString(16).padStart(24, "0");
    // change time where first is furtherest from original time
    let adjustedDate = new Date(
      originalDate.getTime() + i * intervalMilliseconds
    );

    let listing = {
      _id: newListingId,
      listingNum: 5 + i,
      offeringPokemon: new mongoose.Types.ObjectId(newId),
      seekingSpecies: speciesBulbasaur._id,
      isSeekingShiny: (i + 1) % 5 === 0, // every 5th one is true
      listedBy: userAgatha._id,
      dateCreated: adjustedDate,
      status: "Active",
      offers: [],
      acceptedOffer: null,
    };

    listings.push(listing);
  }
  return listings;
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

// --------- LISTINGS ---------
const listingIvyForBulbVenti = {
  _id: new mongoose.Types.ObjectId("000000000000000000003864"),
  listingNum: 1,
  offeringPokemon: pokemonVentisIvyasaur._id,
  seekingSpecies: speciesBulbasaur._id,
  isSeekingShiny: true,
  listedBy: userVenti._id,
  dateCreated: new Date(1716069600), // Sun May 19 2024 10:00:00 GMT+1200 (New Zealand Standard Time)
  status: "Active",
  offers: [{ offer: new mongoose.Types.ObjectId("000000000000000000065828") }],
  acceptedOffer: null,
};
const listingIvyForBulbNavia = {
  _id: new mongoose.Types.ObjectId("000000000000000000003865"),
  listingNum: 2,
  offeringPokemon: pokemonNaviasIvysaur._id,
  seekingSpecies: speciesBulbasaur._id,
  isSeekingShiny: false,
  listedBy: userNavia._id,
  dateCreated: new Date(1729265961), // Sat Oct 19 2024 04:39:21 GMT+1300 (New Zealand Daylight Time)
  status: "Active",
  offers: [],
  acceptedOffer: null,
};
const listingIvyForLunaLynney = {
  _id: new mongoose.Types.ObjectId("000000000000000000003866"),
  listingNum: 3,
  offeringPokemon: pokemonLynneysIvyasaur._id,
  seekingSpecies: speciesLunala._id,
  isSeekingShiny: false,
  listedBy: userLynney._id,
  dateCreated: new Date(1731857961), //Mon Nov 18 2024 04:39:21 GMT+1300 (New Zealand Daylight Time)
  status: "Active",
  offers: [],
  acceptedOffer: null,
};
const listingLunaForBulbNavia = {
  _id: new mongoose.Types.ObjectId("000000000000000000003867"),
  listingNum: 4,
  offeringPokemon: pokemonNaviasLunalaDup1._id,
  seekingSpecies: speciesBulbasaur._id,
  isSeekingShiny: false,
  listedBy: userNavia._id,
  dateCreated: new Date(1731914354), // Mon Nov 18 2024 20:19:14 GMT+1300 (New Zealand Daylight Time)
  status: "Active",
  offers: [
    { offer: new mongoose.Types.ObjectId("000000000000000000065827") },
    { offer: new mongoose.Types.ObjectId("000000000000000000065899") },
  ],
  acceptedOffer: null,
};

// --------- Offers ---------
const offerBulbForNaviaLunaListing = {
  _id: new mongoose.Types.ObjectId("000000000000000000065827"),
  offerNum: 2,
  offeredPokemon: pokemonFurinaBulbasaur1._id,
  listing: listingLunaForBulbNavia._id,
  offeredBy: userFurina._id,
  status: "Pending",
  dateCreated: new Date(),
  dateAccepted: null,
};
const randomBulbForNaviaLunaListing = {
  _id: new mongoose.Types.ObjectId("000000000000000000065899"),
  offerNum: 6,
  offeredPokemon: pokemonFurinaBulbasaur3._id,
  listing: listingLunaForBulbNavia._id,
  offeredBy: userFurina._id,
  status: "Pending",
  dateCreated: new Date(),
  dateAccepted: null,
};
const offerBulbForVentiIvyListing = {
  _id: new mongoose.Types.ObjectId("000000000000000000065828"),
  offerNum: 3,
  offeredPokemon: pokemonFurinaBulbasaur2._id,
  listing: listingIvyForBulbVenti._id,
  offeredBy: userFurina._id,
  status: "Pending",
  dateCreated: new Date(),
  dateAccepted: null,
};
const offerBulbForVentiIvyListingDeclined = {
  _id: new mongoose.Types.ObjectId("000000000000000000065829"),
  offerNum: 4,
  offeredPokemon: pokemonFurinaBulbasaur2._id,
  listing: listingIvyForBulbVenti._id,
  offeredBy: userFurina._id,
  status: "Declined",
  dateCreated: new Date(),
  dateAccepted: null,
};
const offerBulbForVentiIvyListingAccepted = {
  _id: new mongoose.Types.ObjectId("000000000000000000065830"),
  offerNum: 5,
  offeredPokemon: pokemonFurinaBulbasaur2._id,
  listing: listingIvyForBulbVenti._id,
  offeredBy: userFurina._id,
  status: "Accepted",
  dateCreated: new Date(),
  dateAccepted: null,
};

// --------- Functions ---------
async function addMockSpecies() {
  const speciesDB = mongoose.connection.db.collection("species");
  await speciesDB.insertMany([
    speciesIvysaur,
    speciesBulbasaur,
    speciesVenusaur,
    speciesShaymin,
    speciesLunala,
    speciesOddish,
  ]);
}
async function addMockUsers() {
  const usersDB = mongoose.connection.db.collection("users");
  await usersDB.insertMany([
    userLynney,
    userNavia,
    userVenti,
    userFurina,
    userAgatha,
  ]);
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
    pokemonVentisLunalaTradeable,
    pokemonFurinaBulbasaur1,
    pokemonFurinaBulbasaur2,
    pokemonFurinaBulbasaur3,
    pokemonFurinaLunala,
  ]);
  await pokemonsDB.insertMany(agathaList);
  await pokemonsDB.insertOne(pokemonAgathasLockedLunala);
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

async function addMockListings() {
  let listingDB = mongoose.connection.db.collection("listings");
  let agathasListings = makeAgathasListings();

  await listingDB.insertMany([
    listingIvyForBulbVenti,
    listingIvyForBulbNavia,
    listingIvyForLunaLynney,
    listingLunaForBulbNavia,
    ...agathasListings,
  ]);
}

async function addMockOffers() {
  const offerDB = mongoose.connection.db.collection("offers");
  await offerDB.insertMany([
    offerBulbForNaviaLunaListing,
    randomBulbForNaviaLunaListing,
    offerBulbForVentiIvyListing,
    offerBulbForVentiIvyListingDeclined,
    offerBulbForVentiIvyListingAccepted,
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
  await addMockListings();
  await addMockOffers();
}

export {
  speciesBulbasaur,
  speciesIvysaur,
  speciesVenusaur,
  speciesLunala,
  speciesShaymin,
  speciesOddish,
  userLynney,
  userNavia,
  userVenti,
  userFurina,
  userAgatha,
  bearerLynney,
  bearerNavia,
  bearerVenti,
  bearerFurina,
  bearerAgatha,
  pokemonLynneysIvyasaur,
  pokemonNaviasLunala,
  pokemonNaviasIvysaur,
  pokemonVentisIvyasaur,
  pokemonVentisLunala,
  pokemonVentisLunalaTradeable,
  pokemonAgathasLunala,
  pokemonAgathasLockedLunala,
  pokemonFurinaBulbasaur1,
  pokemonFurinaBulbasaur2,
  pokemonFurinaBulbasaur3,
  pokemonFurinaLunala,
  ventisIncubatorGhost,
  ventisIncubatorGrass,
  listingIvyForBulbNavia,
  listingIvyForLunaLynney,
  listingIvyForBulbVenti,
  listingLunaForBulbNavia,
  offerBulbForNaviaLunaListing,
  offerBulbForVentiIvyListing,
  offerBulbForVentiIvyListingAccepted,
  offerBulbForVentiIvyListingDeclined,
  addAllMockData,
};

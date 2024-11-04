// ------------- POKEMON -------------
const vullaby = {
  _id: "66002aa17b72b1ff8cf3e9d6",
  species: {
    image: {
      normal:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/629.png",
      shiny:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/629.png",
    },
    _id: "65f307573a6aae800ca987c4",
    dexNumber: 629,
    dexEntry:
      "Their wings are too tiny to allow them to fly. They guard their posteriors with bones that were gathered by Mandibuzz.",
    name: "vullaby",
    types: ["dark", "flying"],
    height: 5,
    weight: 90,
    isLegendary: false,
    __v: 0,
  },
  originalOwner: { _id: "000000000000000000000001", username: "Lynney" },
  currentOwner: { _id: "000000000000000000000001", username: "Lynney" },
  isShiny: false,
  isTradeable: false,
  isLocked: false,
  __v: 0,
};

const wochien = {
  _id: "66002aa27b72b1ff8cf3e9dd",
  species: {
    image: {
      normal:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1001.png",
      shiny:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1001.png",
    },
    _id: "65f308163a6aae800ca98aac",
    dexNumber: 1001,
    dexEntry:
      "The grudge of a person punished for writing the king’s evil deeds upon wooden tablets has clad itself in dead leaves to become a Pokémon.",
    name: "wo-chien",
    types: ["dark", "grass"],
    height: 15,
    weight: 742,
    isLegendary: true,
    __v: 0,
  },
  originalOwner: { _id: "000000000000000000000001", username: "Lynney" },
  currentOwner: { _id: "000000000000000000000001", username: "Lynney" },
  isShiny: false,
  isTradeable: false,
  isLocked: false,
  __v: 0,
};

const gabite = {
  _id: "66002aa27b72b1ff8cf3e9e1",
  species: {
    image: {
      normal:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/444.png",
      shiny:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/444.png",
    },
    _id: "65f306f53a6aae800ca98652",
    dexNumber: 444,
    dexEntry:
      "There is a long-held belief that medicine made from its scales will heal even incurable illnesses.",
    name: "gabite",
    types: ["dragon", "ground"],
    height: 14,
    weight: 560,
    isLegendary: false,
    __v: 0,
  },
  originalOwner: { _id: "000000000000000000000001", username: "Lynney" },
  currentOwner: { _id: "000000000000000000000001", username: "Lynney" },
  isShiny: false,
  isTradeable: false,
  isLocked: false,
  __v: 0,
};

const misdrevus = {
  _id: "66002aa27b72b1ff8cf3e9e5",
  species: {
    image: {
      normal:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/200.png",
      shiny:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/200.png",
    },
    _id: "65f306763a6aae800ca9846a",
    dexNumber: 200,
    dexEntry:
      "It likes playing mischievous tricks such as screaming and wailing to startle people at night.",
    name: "misdreavus",
    types: ["ghost"],
    height: 7,
    weight: 10,
    isLegendary: false,
    __v: 0,
  },
  originalOwner: { _id: "000000000000000000000001", username: "Lynney" },
  currentOwner: { _id: "000000000000000000000001", username: "Lynney" },
  isShiny: false,
  isTradeable: false,
  isLocked: false,
  __v: 0,
};

const testUser = {
  _id: "000000000000000000000002",
  username: "testuser",
  email: "testemail@email.com",
  image:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png",
};

const mockTestPayload = {
  _id: testUser._id,
  username: testUser.username,
  exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expiration time: current time + 1 hour
};
// Encode payload as base64 (JWT tokens are base64 encoded)
const testToken = Buffer.from(JSON.stringify(mockTestPayload)).toString(
  "base64"
);

const lynneyUser = {
  _id: "000000000000000000000001",
  username: "Lynney",
  email: "lynney@email.com",
  image:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png",
};
// Mock token payload
const mockLynneyPayload = {
  _id: lynneyUser._id,
  username: lynneyUser.username,
  exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expiration time: current time + 1 hour
};

// Encode payload as base64 (JWT tokens are base64 encoded)
const lynneyToken = Buffer.from(JSON.stringify(mockLynneyPayload)).toString(
  "base64"
);

const lynneyPokemon = [misdrevus, vullaby, wochien, gabite];

// Incubators
const currentTime = new Date().getTime()
const grassIncubator = {
  _id: "000000000000000000000059",
  hatcher: lynneyUser._id,
  hatchTime: new Date(currentTime + 5 * 60 * 60 * 1000), // 5 hours in future
  isLegendary: true,
  pokemonType: "grass",
  species: wochien._id,
};

const ghostIncubator = {
  _id: "000000000000000000000060",
  hatcher: lynneyUser._id,
  hatchTime: new Date("July 1, 2024 11:13:00"), // Past Dates
  isLegendary: false,
  pokemonType: "ghost",
  species: misdrevus._id,
};

const darkIncubator = {
  _id: "000000000000000000000061",
  hatcher: lynneyUser._id,
  hatchTime: new Date(currentTime + 50 * 60 * 1000), // 50 mins
  isLegendary: false,
  pokemonType: "dark",
  species: vullaby._id,
};
const lynneyIncubators = [grassIncubator, ghostIncubator, darkIncubator];
export {
  testUser,
  lynneyUser,
  mockTestPayload,
  mockLynneyPayload,
  testToken,
  lynneyToken,
  lynneyPokemon,
  darkIncubator,
  ghostIncubator,
  grassIncubator,
  lynneyIncubators,
  misdrevus,
};

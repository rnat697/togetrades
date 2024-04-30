import express from "express";
import auth from "../auth/auth.js";
import {
  retrievePokemonForUser,
  retrievePokemonById,
  updateFavUserPokemon,
  updateTradeableUserPokemon,
  calculateNumTradeable,
} from "../db/pokemon-utils.js";
import {
  getRandomSpeciesFromList,
  getSpeciesByFilter,
} from "../db/species-utils.js";
import {
  isLegendaryEggProbability,
  retrieveIncubatorsForUser,
} from "../db/incubator-utils.js";
import Incubator from "../db/incubator-schema.js";

const router = express.Router();
// Get all incubators related to user
router.get("/", auth, async (req, res) => {
  const incubators = await retrieveIncubatorsForUser(userID);
  return res.json(incubators);
});

// create new incubators based on type choosen.
router.post("/:type/create", auth, async (req, res) => {
  try {
    const type = req.params;
    const userID = req.user._id;
    if (!isValidPokemonType(type))
      return res.status(422).send("Not a valid pokemon type.");
    const incubators = await retrieveIncubatorsForUser(userID);
    if (incubators.length > 4) {
      return res
        .status(403)
        .send(
          "Maximum limit of incubators reached. Only 4 incubators can be active at any time."
        );
    }

    const isLegendary = isLegendaryEggProbability();
    let generatedSpecies;
    const speciesFilter = { types: { $in: type }, isLegendary: isLegendary };
    const speciesList = getSpeciesByFilter(speciesFilter);

    generatedSpecies = getRandomSpeciesFromList(speciesList);
    console.log(species);
    const hatchTime = new Date();
    hatchTime.setHours(hatchTime.getHours() + isLegendary ? 6 : 3);

    const incubator = await Incubator.create({
      hatcher: userID,
      hatchTime: hatchTime,
      hatched: false,
      isLegendary: isLegendary,
      pokemonType: type,
      species: generatedSpecies._id,
    });
    return res.status(201).json({ success: true, incubator });
  } catch (error) {
    console.error("Error creating incubator: ", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;

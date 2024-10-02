import express from "express";
import auth from "../auth/auth.js";
import { createPokemon } from "../db/pokemon-utils.js";
import {
  getRandomSpeciesFromList,
  getSpeciesByFilter,
} from "../db/species-utils.js";
import {
  isLegendaryEggProbability,
  retrieveIncubatorsForUser,
  findIncubatorById,
  isValidPokemonType,
} from "../db/incubator-utils.js";
import Incubator from "../db/incubator-schema.js";

const router = express.Router();
// Get all incubators related to user
router.get("/", auth, async (req, res) => {
  let userID = req.user._id;
  try {
    const incubators = await retrieveIncubatorsForUser(userID);
    return res.status(200).json(incubators);
  } catch (e) {
    console.error("Error fetching incubators: ", e);
    return res.status(500).send("Internal Server Error");
  }
});

// create new incubators based on type choosen.
router.post("/:type/create", auth, async (req, res) => {
  try {
    const type = req.params.type;
    const userID = req.user._id;
    if (!isValidPokemonType(type))
      return res.status(422).send("Not a valid pokemon type.");
    const incubators = await retrieveIncubatorsForUser(userID);
    if (incubators.length >= 4) {
      return res
        .status(403)
        .send(
          "Maximum limit of incubators reached. Only 4 incubators can be active at any time."
        );
    }

    const isLegendary = isLegendaryEggProbability();
    let generatedSpecies;
    const speciesFilter = { types: { $in: [type] }, isLegendary: isLegendary };
    const speciesList = await getSpeciesByFilter(speciesFilter);

    generatedSpecies = getRandomSpeciesFromList(speciesList);
    const hatchTime = new Date();
    const hoursToAdd = isLegendary ? 6 : 3;
    hatchTime.setTime(hatchTime.getTime() + hoursToAdd * 60 * 60 * 1000);

    const incubator = await Incubator.create({
      hatcher: userID,
      hatchTime: hatchTime,
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

// DELETE /incubators/{uid}/hatch
// "hatches" egg, creates new pokemon from species and deletes incubator
router.delete("/:id/hatch", auth, async (req, res) => {
  try {
    const incubatorExist = await findIncubatorById(req.params.id);
    const timeNow = new Date();
    if (!incubatorExist)
      return res.status(404).send("Incubator can not be found.");
    let hatchTime = incubatorExist.hatchTime;

    // dont hatch if the current time is less than the hatch time.
    if (timeNow.getTime() < hatchTime.getTime()) {
      return res.status(403).send("Egg cannot be hatched yet");
    }
    // "hatch" pokemon
    const pokemon = await createPokemon(
      req.user._id,
      incubatorExist.species._id
    );

    // populate fields for display
    const populatedPoke = await pokemon.populate([
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

    // delete incubator
    const result = await Incubator.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      return res.status(200).json({ success: true, pokemon: populatedPoke });
    } else {
      throw "No documents matched query. Deleted 0 documents.";
    }
  } catch (error) {
    console.error("Error hatching pokemon - ", error);
    return res
      .status(500)
      .send("Internal Server Error when hatching egg from incubator.");
  }
});

// DELETE /incubators/{uid}/cancel
// deletes incubator if user wants to cancel it
router.delete("/:id/cancel", auth, async (req, res) => {
  try {
    const incubatorExist = await findIncubatorById(req.params.id);

    if (!incubatorExist)
      return res.status(404).send("Incubator can not be found.");

    // delete incubator
    const result = await Incubator.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      return res.sendStatus(204);
    } else {
      throw "No documents matched query. Deleted 0 documents.";
    }
  } catch (error) {
    console.error("Error cancelling incubator - ", error);
    return res
      .status(500)
      .send("Internal Server Error when cancelling incubation.");
  }
});

export default router;

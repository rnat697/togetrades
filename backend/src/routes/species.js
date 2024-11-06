import express from "express";
import Species from "../db/species-schema.js";
import auth from "../auth/auth.js";
import mongoose from "mongoose";
import Pokemon from "../db/pokemon-schema.js";
import User from "../db/user-schema.js";

const router = express.Router();

/**
 * GET /species/
 * Gets all the species with pagination for the pokedex
 * ALso shows if species has been caught by a user or not
 * @param {page} - page number default is 1
 * @param {limit} - the maximum species to return, default is 20
 *
 */
router.get("/", auth, async (req, res) => {
  try {
    // check if user exists
    let userId = req.user._id;
    const userExist = await User.findById(userId);
    if (!userExist) return res.status(404).send("User can not be found");

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // Gets all species based on page number
    const species = await Species.aggregate([
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const totalPages = Math.ceil(species[0].metadata[0].totalCount / limit);

    // Check if the requested page exceeds total pages
    if (page > totalPages && totalPages > 0) {
      return res
        .status(400)
        .send(`Page ${page} exceeds the maximum of ${totalPages}.`);
    }
    // Gets user's pokemon to compare
    const pokemon = await Pokemon.find({ currentOwner: userId }).select(
      "species"
    );
    const caughtSpeciesId = pokemon.map((poke) => poke.species.toString());

    // finds missing species based on user's pokemon
    const updatedSpecies = species[0].data.map((specie) => ({
      ...specie,
      isMissing: !caughtSpeciesId.includes(specie._id.toString()),
    }));

    return res.status(200).json({
      success: true,
      metadata: {
        totalCount: species[0].metadata[0].totalCount,
        page,
        totalPages,
        limit,
      },
      data: updatedSpecies,
    });
  } catch (error) {
    console.error("Error retrieving Species: ", error);
    return res
      .status(500)
      .send("Internal Server Error when retrieving Speices");
  }
});

/**
 * GET /species/item/:id
 * Gets one species based on ID, also has metadata field that shows next and previous species
 * @param {dexNumber} - the dexnumber of the species
 * @param {user._id} - the id of the user
 *
 */
router.get("/item/:dexNumber", auth, async (req, res) => {
  try {
    // check if user exists
    let userId = req.user._id;
    const userExist = await User.findById(userId);
    if (!userExist) return res.status(404).send("User can not be found");

    // Gets specieic species based on species id
    const species = await Species.findOne({dexNumber:req.params.dexNumber}).lean();
    console.log(species);
    
    if (!species) {
      return res.status(404).send("Species not found");
    }
    // Use the species' pokedexNumber to find the previous and next species
    const previousSpecies = await Species.findOne({
      dexNumber: species.dexNumber - 1,
    }).select("_id name dexNumber");
    const nextSpecies = await Species.findOne({
      dexNumber: species.dexNumber + 1,
    }).select("_id name dexNumber");

    // Gets user's pokemon to compare
    const doesPokemonExist = await Pokemon.exists({
      species: species._id,
      currentOwner: userId,
    });

    // finds missing species based on user's pokemon
    const updatedSpecies = {
      ...species,
      isMissing: !doesPokemonExist,
    };
    return res.status(200).json({
      success: true,
      metadata: {
        previous: previousSpecies || null,
        next: nextSpecies || null,
      },
      data: updatedSpecies,
    });
  } catch (error) {
    console.error("Error retrieving singular species: ", error);
    return res
      .status(500)
      .send("Internal Server Error when retrieving singular speices.");
  }
});

export default router;

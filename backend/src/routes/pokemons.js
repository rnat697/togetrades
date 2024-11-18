import express from "express";
import auth from "../auth/auth.js";
import {
  retrievePokemonForUser,
  retrievePokemonById,
  updateFavUserPokemon,
  updateLockedPokemon,
  calculateNumTradeable,
} from "../db/pokemon-utils.js";
import Pokemon from "../db/pokemon-schema.js";
import User from "../db/user-schema.js";
import mongoose from "mongoose";
import Species from "../db/species-schema.js";

const router = express.Router();

// Updating the locked flag of an owner's pokemon.
// Users can only update this if they are the current owner of that pokemon.
// Can only lock a pokemon if it is not tradeable.
router.patch("/:id/setLocked", auth, async (req, res) => {
  try {
    const lockUpdates = req.body;
    const pokemon = await retrievePokemonById(req.params.id);

    if (Object.keys(lockUpdates).length == 0) {
      return res.status(422).send("Empty request body");
    }

    if (!pokemon) return res.status(404).send("Pokemon can not be found.");
    if (!pokemon.currentOwner.equals(req.user._id)) {
      return res.status(403).send("Pokemon is not owned by user.");
    }
    if (pokemon.isTrading) {
      return res
        .status(403)
        .send("The pokemon is in an active trade. It can not be locked.");
    }

    const update = await updateLockedPokemon(lockUpdates, req.params.id);
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error updating lock status: ", error);
    return res.status(500).send("Internal Server Error");
  }
});

// ----- GET ALL pokemon available for trading -----
/**
 * Fetches user's eligable pokemon for offering
 * - Pokemon available must not be in an active trade, hasn't been traded away before and isn't locked.
 * @param {id} - The user id of the user
 * @param {page} - page number default is 1
 * @param {limit} - maximum species to return default is 24
 */
router.get("/all-eligible-pokemon", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    if (page <= 0) {
      return res.status(400).send(`Page must be greater than 0`);
    }
    const limit = parseInt(req.query.limit, 10) || 24;
    const skip = (page - 1) * limit;

    // create query
    const query = {
      currentOwner: new mongoose.Types.ObjectId(userId),
      isLocked: false,
      isTrading: false,
      hasBeenTraded: false,
    };

    const pokemon = await Pokemon.find(query)
      .skip(skip)
      .limit(limit)
      .populate("species");

    // count total pokemon for pagination
    const totalCount = await Pokemon.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Check if the requested page exceeds total pages
    if (page > totalPages && totalPages > 0) {
      return res
        .status(400)
        .send(`Page ${page} exceeds the maximum of ${totalPages}.`);
    }

    return res.status(200).json({
      success: true,
      metadata: {
        totalCount: totalCount,
        page,
        totalPages,
        limit,
      },
      data: pokemon,
    });
  } catch (e) {
    console.error("Error retrieving tradeable Pokemon: ", e);
    return res
      .status(500)
      .send("Internal server error when retrieving tradeable Pokemon.");
  }
});

// ----- GET specific species of user's pokemon available for trading -----
/**
 * Fetches user's eligable pokemon for offering filter by species id
 * - Pokemon available must not be in an active trade, hasn't been traded away before and isn't locked.
 * @param {id} - The species id
 */
router.get("/elegible-pokemon/:id", auth, async (req, res) => {
  try {
    const speciesId = req.params.id;
    const userId = req.user._id;

    const speciesExist = await Species.findById(speciesId);
    if (!speciesExist) return res.status(404).send("Species not found.");

    const query = {
      species: speciesId,
      currentOwner: userId,
      isLocked: false,
      isTrading: false,
      hasBeenTraded: false,
    };
    const pokemon = await Pokemon.find(query);
    return res
      .status(200)
      .json({ success: true, data: pokemon, isEmpty: pokemon.length === 0 });
  } catch (e) {
    console.error("Error retrieving tradeable Pokemon: ", e);
    return res
      .status(500)
      .send("Internal server error when retrieving tradeable Pokemon.");
  }
});

export default router;

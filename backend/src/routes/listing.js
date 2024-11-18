import express from "express";
import mongoose from "mongoose";
import auth from "../auth/auth.js";
import Pokemon from "../db/pokemon-schema.js";
import Species from "../db/species-schema.js";
import User from "../db/user-schema.js";
import Listing from "../db/listing-schema.js";
import Counter from "../db/counter-schema.js";

const router = express.Router();

// ----- CREATE NEW LISTING -----
/**
 * Creates a new trade listing
 * - Pokemon offered must not be in an active trade, hasn't been traded away before and isn't locked.
 * - Species sought must be in user's wishlist (at the moment, can be changed later)
 * @param {offeredPokeId} - The ID of the offered pokemon
 * @param {seekSpeciesId} - The ID of the sought species
 * @param {userId} - The user id of the user who made the listing (get by req.params.id)
 */
router.post("/create", auth, async (req, res) => {
  try {
    let userId = req.user._id;
    const { offeredPokeId, seekSpeciesId } = req.body;

    // check if pokemon exists
    const pokeExist = await Pokemon.findById(offeredPokeId);
    if (!pokeExist) return res.status(404).send("Pokemon can not be found.");

    // check if species exists
    const speciesExist = await Species.findById(seekSpeciesId);
    if (!speciesExist)
      return res.status(404).send("Pokemon speices can't be found.");

    // Check if pokemon is in active trade
    if (pokeExist.isTrading)
      return res
        .status(409)
        .send(
          "Pokemon is in an active trade, it can't be used for new listings or trade offers"
        );

    // check if pokemon has been traded away before
    if (!pokeExist.canBeTraded)
      return res
        .status(400)
        .send("Pokemon has been traded away before and can't be traded again.");

    // check if pokemon is currently locked
    if (pokeExist.isLocked)
      return res
        .status(423)
        .send("Pokemon is currently locked and can't be traded.");

    // check if species is in user's wishlist
    const user = await User.findById(userId);
    if (!user.wishlist.some((species) => species._id === seekSpeciesId))
      return res.status(404).send("Species not found in user's wishlist,");

    // Get next listing number
    const counter = await Counter.findOneAndUpdate(
      { counterName: "listingNum" }, // Find the document by counterName
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const listingNum = counter.seq; // Get the updated seq value

    const listing = await Listing.create({
      listingNum: listingNum,
      offeringPokemon: offeredPokeId,
      seekingSpecies: seekSpeciesId,
      listedBy: userId,
      dateCreated: Date.now(),
    });

    return res
      .status(201)
      .send({ success: true, message: "Listing created successfully" });
  } catch (e) {
    console.error("Error retrieving Pokemon: ", e);
    return res
      .status(500)
      .send("Internal Server Error when retrieving Pokemon.");
  }
});

export default router;

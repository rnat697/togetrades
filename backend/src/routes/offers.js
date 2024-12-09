import express from "express";
import auth from "../auth/auth.js";
import Counter from "../db/counter-schema.js";
import Pokemon from "../db/pokemon-schema.js";
import Listing from "../db/listing-schema.js";
import Offer from "../db/offer-schema.js";

const router = express.Router();
// ----- CREATE NEW OFFER -----
/**
 * POST /create
 * creates a new offer for a listing
 * @param {offeredPokeId} - id of the offered pokemon
 * @param {listingId} -  id of the listing associated with the offer
 *
 */

router.post("/create", auth, async (req, res) => {
  try {
    let userId = req.user._id;
    const { offeredPokeId, listingId } = req.body;

    // check if offeredPokeId and listingId isn't empty
    if (!offeredPokeId || !listingId)
      return res
        .status(400)
        .send("Offered pokemon ID or listing ID is required.");

    // check if pokemon exists;
    const pokeExist = await Pokemon.findById(offeredPokeId);
    if (!pokeExist) return res.status(404).send("Pokemon can not be found.");

    // check if listing exists
    const listingExist = await Listing.findById(listingId);
    if (!listingExist) return res.status(404).send("Listing can not be found");

    // check if the species id is the same as in the listing
    if (
      pokeExist.species._id.toString() !==
      listingExist.seekingSpecies._id.toString()
    )
      return res
        .status(400)
        .send(
          "Offered pokemon is not the same species that the listing is seeking."
        );

    // Check if pokemon is in active trade
    if (pokeExist.isTrading)
      return res
        .status(409)
        .send(
          "Pokemon is in an active trade, it can't be used for new listings or trade offers"
        );

    // check if pokemon has been traded away before
    if (pokeExist.hasBeenTraded)
      return res
        .status(400)
        .send("Pokemon has been traded away before and can't be traded again.");

    // check if pokemon is currently locked
    if (pokeExist.isLocked)
      return res
        .status(423)
        .send("Pokemon is currently locked and can't be traded.");

    // Get next offer number
    const counter = await Counter.findOneAndUpdate(
      { counterName: "offerNum" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const offerNum = counter.seq;

    const offer = await Offer.create({
      offerNum: offerNum,
      offeredPokemon: offeredPokeId,
      listing: listingId,
      offeredBy: userId,
      dateCreated: Date.now(),
    });

    // Update pokemon's isTrading to true because its an active trade
    pokeExist.isTrading = true;
    await pokeExist.save();
    // TODO: potential socket.io notification here?
    return res
      .status(201)
      .send({ success: true, message: "Offer created successfully." });
  } catch (error) {
    console.error("Error retrieving Pokemon: ", error);
    return res
      .status(500)
      .send("Internal Server Error when retrieving Pokemon.");
  }
});

// ----- GETS USER'S OUTGOING OFFERS -----
/**
 * GET /outgoing-offers/:userId
 * returns a list of outgoing offers that the user has made
 * @param {userId} - user id so we can retrieve their outgoing offers
 *
 */

export default router;

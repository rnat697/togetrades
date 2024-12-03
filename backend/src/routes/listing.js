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
    const { offeredPokeId, seekSpeciesId, isSeekingShiny } = req.body;

    // check if offeredPokeId and seekSpeciesId isn't empty
    if (!offeredPokeId || !seekSpeciesId || isSeekingShiny == null) {
      return res
        .status(400)
        .send("offered pokemon ID or seeking species ID is required");
    }

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
    if (pokeExist.hasBeenTraded)
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
    if (!user.wishlist.some((item) => item.species._id == seekSpeciesId))
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
      isSeekingShiny: isSeekingShiny,
      listedBy: userId,
      dateCreated: Date.now(),
    });

    // Update pokemon's isTrading to true because its an active trade
    pokeExist.isTrading = true;
    await pokeExist.save();

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

// ----- GETS ALL LISTINGS -----
/**
 * fetches all listings, sorted by recents and pagination, only finds "Active" listings
 * @param {page} - page number
 * @param {limit} - the limit of the number of listings, default 10
 */
router.get("/", auth, async (req, res) => {
  try {
    // Paginations
    const page = parseInt(req.query.page) || 1;
    if (page <= 0) page = 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    // fetch all listings (active)
    const listings = await Listing.find({ status: "Active" })
      .sort({ dateCreated: -1 }) // Sort by recency
      .skip(skip) // Pagination
      .limit(limit)
      .populate({
        path: "offeringPokemon",
        populate: { path: "species", model: "Species" },
      })
      .populate("seekingSpecies")
      .populate("listedBy", "username image");

    const totalCount = await Listing.countDocuments({ status: "Active" });
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
      data: listings,
    });
  } catch (e) {
    console.error("Error retrieving recent listings: ", e);
    return res
      .status(500)
      .send("Internal server error when fetching recent listings.");
  }
});

// ----- GETS SPECIFIC LISTING -----
/**
 * Fetches a specified listing
 * @param {id} - Listing Id
 */
router.get("/:listingId", auth, async (req,res)=>{
  try{
    const listingId  = req.params.listingId;

    const listing = await Listing.findById(listingId)
      .populate({
        path: "offeringPokemon",
        populate: { path: "species", model: "Species" },
      })
      .populate("seekingSpecies")
      .populate("listedBy", "username image");

    if(!listing) return res.status(404).send("Listing not found.");

    return res.status(200).json({
      success: true,
      data: listing,
    })
  }catch(error){
    console.error("Error retrieving listing: ", error);
      return res
        .status(500)
        .send("Internal Server Error when retrieving listing.");
  }
});


export default router;

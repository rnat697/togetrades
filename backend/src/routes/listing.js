import express from "express";
import mongoose from "mongoose";
import auth from "../auth/auth.js";
import Pokemon from "../db/pokemon-schema.js";
import Species from "../db/species-schema.js";
import User from "../db/user-schema.js";
import Listing from "../db/listing-schema.js";
import Counter from "../db/counter-schema.js";
import { populate } from "dotenv";

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
 * 1. fetches all listings, sorted by recents and pagination, only finds "Active" listings 
 * 2. Fetches all of the user's listing if the param for userId is specified. (includes inactive listings)
 * @param {page} - page number
 * @param {limit} - the limit of the number of listings, default 10
 * @param {userId} - optional, the id of the user. Used to fetch the user's listings only.
 */
router.get("/", auth, async (req, res) => {
  try {
    // Paginations
    const page = parseInt(req.query.page) || 1;
    if (page <= 0) page = 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const userId = req.query.userId || null;

    const filter = userId ? { listedBy: userId } : { status: "Active" };

    // fetch all listings (active)
    const listings = await Listing.find(filter)
      .sort({ dateCreated: -1 }) // Sort by recency
      .skip(skip) // Pagination
      .limit(limit)
      .populate({
        path: "offeringPokemon",
        populate: { path: "species", model: "Species" },
      })
      .populate("seekingSpecies")
      .populate("listedBy", "username image");

    const totalCount = await Listing.countDocuments(filter);
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
router.get("/:listingId", auth, async (req, res) => {
  try {
    const listingId = req.params.listingId;

    const listing = await Listing.findById(listingId)
      .populate({
        path: "offeringPokemon",
        populate: { path: "species", model: "Species" },
      })
      .populate("seekingSpecies")
      .populate("listedBy", "username image")
      .populate({
        path: "offers", // Populate the offers array
        populate: {
          path: "offer", // Populate the `offer` field inside each object in the offers array
          model: "Offer", // Reference the Offer model
          populate: [
            {
              path: "offeredPokemon", // Populate offeredPokemon inside the Offer
              populate: {
                path: "species",
                select: "image name isLegendary",
                model: "Species",
              },
            },
            {
              path: "offeredBy", // Populate offeredBy inside the Offer
              select: "username image",
            },
            {
              path: "listing", // Populate listing inside the Offer
              select: "listingNum",
            },
          ],
        },
      })
      .populate({
        path: "acceptedOffer",
        model: "Offer",
        populate: [
          {
            path: "offeredPokemon",
            model: "Pokemon",
            populate: {
              path: "species",
              select: "image name isLegendary",
              model: "Species",
            },
          },
          {
            path: "offeredBy",
            select: "username image",
          },
          {
            path: "listing",
            select: "listingNum",
          },
        ],
      });

    if (!listing) return res.status(404).send("Listing not found.");

    // check if user has the offered pokemon
    let userId = req.user._id;
    const doesOwnOffering =
      (await Pokemon.countDocuments({
        currentOwner: userId,
        originalOwner: userId,
        speciesId: listing.offeringPokemon.species._id,
        isLocked: false,
        isTrading: false,
        hasBeenTraded: false,
      })) > 0;
    const doesOwnSeeking =
      (await Pokemon.countDocuments({
        currentOwner: userId,
        originalOwner: userId,
        species: listing.seekingSpecies._id,
        isLocked: false,
        isTrading: false,
        hasBeenTraded: false,
      })) > 0;

    return res.status(200).json({
      success: true,
      data: listing,
      metadata: {
        doesOwnOffering,
        doesOwnSeeking,
      },
    });
  } catch (error) {
    console.error("Error retrieving listing: ", error);
    return res
      .status(500)
      .send("Internal Server Error when retrieving listing.");
  }
});


export default router;

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

    // Update listing to include offer
    listingExist.offers.push({offer:offer._id});
    await listingExist.save();

    // TODO: potential socket.io notification here?
    return res
      .status(201)
      .send({ success: true, message: "Offer created successfully." });
  } catch (error) {
    console.error("Error when creating offer: ", error);
    return res.status(500).send("Internal Server Error when creating offer.");
  }
});

// ----- GETS USER'S OUTGOING OFFERS -----
/**
 * GET /outgoing-offers/:userId
 * returns a list of outgoing offers that the user has made
 * @param {userId} - user id so we can retrieve their outgoing offers
 * @param {page} - page number, default is 1
 * @param {limit} - maximum number of offers per page, default is 10
 *
 */

router.get("/outgoing-offers", auth, async (req, res) => {
  try {
    let userId = req.user._id;
    // Get pagination params from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Define the custom order for the 'status' enum
    const statusOrder = {
      Pending: 1,
      Accepted: 2,
      Declined: 3,
    };

    // Pipeline to fetch and sort the offers
    const offersPipeline = [
      {
        $match: { offeredBy: userId },
      },
      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "Pending"] }, then: 1 },
                { case: { $eq: ["$status", "Accepted"] }, then: 2 },
                { case: { $eq: ["$status", "Declined"] }, then: 3 },
              ],
              default: 0, // Default for invalid statuses
            },
          },
        },
      },
      {
        $sort: { statusOrder: 1 }, // Sort by custom status order
      },
      {
        $skip: skip, // Pagination: skip documents for the current page
      },
      {
        $limit: limit, // Pagination: limit the number of documents
      },
      {
        $lookup: {
          from: "pokemons",
          localField: "offeredPokemon",
          foreignField: "_id",
          as: "offeredPokemon",
          pipeline: [
            {
              $lookup: {
                from: "species",
                localField: "species",
                foreignField: "_id",
                as: "species",
                pipeline: [{ $project: { image: 1, name: 1, isLegendary: 1 } }],
              },
            },
            {
              $unwind: {
                path: "$species",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $unwind: { path: "$offeredPokemon", preserveNullAndEmptyArrays: true },
      }, // Flatten offeredPokemon
      {
        $lookup: {
          from: "listings",
          localField: "listing",
          foreignField: "_id",
          as: "listing",
          pipeline: [
            {
              $lookup: {
                from: "pokemons",
                localField: "offeringPokemon",
                foreignField: "_id",
                as: "offeringPokemon",
                pipeline: [
                  {
                    $lookup: {
                      from: "species",
                      localField: "species",
                      foreignField: "_id",
                      as: "species",
                      pipeline: [
                        { $project: { image: 1, name: 1, isLegendary: 1 } },
                      ],
                    },
                  },
                  {
                    $unwind: {
                      path: "$species",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$offeringPokemon",
                preserveNullAndEmptyArrays: true,
              },
            }, // Flatten offeringPokemon
            {
              $lookup: {
                from: "users",
                localField: "listedBy",
                foreignField: "_id",
                as: "listedBy",
                pipeline: [{ $project: { id: 1, username: 1, image: 1 } }],
              },
            },
            {
              $unwind: { path: "$listedBy", preserveNullAndEmptyArrays: true },
            }, // Flatten listedBy
          ],
        },
      },
      { $unwind: { path: "$listing", preserveNullAndEmptyArrays: true } }, // Flatten listing
      {
        $lookup: {
          from: "users",
          localField: "offeredBy",
          foreignField: "_id",
          as: "offeredBy",
          pipeline: [{ $project: { id: 1, username: 1, image: 1 } }],
        },
      },
      { $unwind: { path: "$offeredBy", preserveNullAndEmptyArrays: true } }, // Flatten offeredBy
    ];

    // Get total count for pagination metadata
    const totalCount = await Offer.countDocuments({ offeredBy: userId });

    // Fetch the offers with the aggregation pipeline
    const offers = await Offer.aggregate(offersPipeline);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    // Check if the requested page exceeds total pages
    if (page > totalPages && totalPages > 0) {
      return res
        .status(400)
        .send(`Page ${page} exceeds the maximum of ${totalPages}.`);
    }

    return res.status(200).json({
      success: true,
      data: offers,
      metadata: {
        isEmpty: offers.length === 0,
        totalCount,
        page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    console.error("Error when retrieving outgoing offers: ", error);
    return res
      .status(500)
      .send("Internal Server Error when retrieving outgoing offers.");
  }
});


export default router;

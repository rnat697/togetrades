import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema for a trade listing.
 * - Listing number
 * - offered pokemon
 * - seeking species
 * - listed by
 * - date created
 * - status
 * - offers
 * - accepted offer
 *
 */
const listingSchema = new Schema({
  listingNum: { type: Number, unique: true, required: true },
  offeringPokemon: {
    type: Schema.Types.ObjectId,
    ref: "Pokemon",
    required: true,
  },
  seekingSpecies: {
    type: Schema.Types.ObjectId,
    ref: "Species",
    required: true,
  },
  isSeekingShiny: { type: Boolean, default: false, required: true },
  listedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dateCreated: { type: Date, default: Date.now(), required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  offers: [
    {
      offer: {
        type: Schema.Types.ObjectId,
        ref: "Offer",
      },
    },
  ],
  acceptedOffer: { type: Schema.Types.ObjectId, ref: "Offer" },
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;

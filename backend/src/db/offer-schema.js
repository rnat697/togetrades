import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema for a trade offer.
 * - offer number
 * - offered Pokemon
 * - listing (id)
 * - offered by
 * - status
 * - date created
 * - date accepted
 *
 */
const offerSchema = new Schema({
  offerNum: { type: Number, unique: true, required: true },
  offeredPokemon: {
    type: Schema.Types.ObjectId,
    ref: "Pokemon",
    required: true,
  },
  listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  offeredBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Declined"],
    default: "Pending",
  },
  dateCreated: { type: Date, default: Date.now, required: true },
  dateAccepted: { type: Date },
});

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;

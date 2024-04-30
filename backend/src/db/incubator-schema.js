import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema for incubators. An incubator has a pokemon and an owner
 */
const incubatorSchema = new Schema({
  hatcher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hatchTime: {
    type: Date,
    required: true,
  },
  hatched: {
    type: Boolean,
    default: false,
  },
  isLegendary: {
    type: Boolean,
    required: true,
  },
  pokemonType: {
    type: String,
    required: true,
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Species",
    required: true,
  },
});

const Incubator = mongoose.model("Incubator", incubatorSchema);
export default Incubator;

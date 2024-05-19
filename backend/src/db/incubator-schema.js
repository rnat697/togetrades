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
//egg image? not sure if i want to host it on server or local

const Incubator = mongoose.model("Incubator", incubatorSchema);
export default Incubator;

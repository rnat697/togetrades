import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema for a particular species of pokemon. There can be multiple pokemon of the same species.
 */
const speciesSchema = new Schema({
  dexNumber: { type: Number, required: true },
  dexEntry: { type: String, required: false },
  name: { type: String, required: true },
  types: [{ type: String, required: true }],
  height: { type: Number, require: true },
  weight: { type: Number, require: true },
  isLegendary: { type: Boolean, default: false },
  image: {
    normal: { type: String, required: true },
    shiny: { type: String, required: true },
  },
});
const Species = mongoose.model("Species", speciesSchema);
export default Species;

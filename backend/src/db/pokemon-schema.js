import mongoose from 'mongoose';

const Schema = mongoose.Schema;


/**
 * Schema for a pokemon. Pokemon have a species and an owner.
 */
const pokemonSchema = new Schema({
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Species",
    required: true,
  },
  originalOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isShiny: { type: Boolean, default: false },
  isTrading: { type: Boolean, default: false }, // Changed to isTrading - true if in active trade, false otherwise
  canBeTraded: { type: Boolean, default: true }, // Flag to see if it has been traded once before (can only trade pokemon that hasnt been traded b4)
  isLocked: { type: Boolean, default: false },
});
const Pokemon = mongoose.model("Pokemon", pokemonSchema);

export default Pokemon;

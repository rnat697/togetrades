import mongoose from 'mongoose';

const Schema = mongoose.Schema;


/**
 * Schema for a pokemon. Pokemon have a species and an owner.
 */
const pokemonSchema = new Schema({
    species: { type: mongoose.Schema.Types.ObjectId, ref: "Species", required: true },
    originalOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    currentOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isShiny: { type: Boolean, default: false },
    isTradeable: {type:Boolean, default:false},
    isFavourite: {type:Boolean, default:false},
});
const Pokemon = mongoose.model("Pokemon", pokemonSchema);

export default Pokemon;

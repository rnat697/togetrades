import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Schema for trade requests.
 * - trade requests have an source pokemon and the target pokemon
 * - the date requested
 * - target user 
 * - source user
 * 
 * **/
const tradeReqSchema = new Schema({
    sourcePokemon: { type: mongoose.Schema.Types.ObjectId, ref: "Pokemon", required: true },
    targetPokemon: { type: mongoose.Schema.Types.ObjectId, ref: "Pokemon", required: true },
    dateRequested: { type: Date, default: Date.now },
    sourceUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

});

const TradeRequest = mongoose.model("TradeRequest", tradeReqSchema);
export default TradeRequest;
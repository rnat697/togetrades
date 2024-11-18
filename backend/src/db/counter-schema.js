import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  counterName: { type: String, required: true, unique: true }, // Use counterName instead of _id
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;

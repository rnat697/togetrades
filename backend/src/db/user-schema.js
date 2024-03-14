import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Schema for a user of the system. 
 *  - Users can own multiple pokemon.
 *  - Users can own multiple incubators
 */
const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: {type:String, unique:true,required:true},
    passHash: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
export default User;


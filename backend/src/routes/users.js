import express from "express";
import User from "../db/user-schema.js";
import bcrypt from "bcrypt";
import { createToken } from "../auth/auth.js";
import { generateStartingPokemonForUser } from "../db/pokemon-utils.js";

const router = express.Router();

// ----- Register new account -----
router.post("/register", async (req, res) => {
  // Username, email and password must be in request
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.sendStatus(422).send("All fields are compulsory");

  // No duplicate usernames or emails
  let existingUsername = await User.findOne({ username });
  let existingEmail = await User.findOne({ email });
  if (existingUsername || existingEmail)
    return res
      .sendStatus(409)
      .send("User already exists with this email or username");

  // Encrypt password
  const encryptPass = await bcrypt.hash(password, 10);
  //Save user in database
  const user = await User.create({
    username,
    email,
    passHash: encryptPass,
  });

  // Genereate pokemon for user
  await generateStartingPokemonForUser(user._id);
  // Generate a token for user and send it
  const token = createToken(user._id.toString(), username);
  return res.status(201).location(`/api/users/${user._id}`).json({ token });
});

export default router;
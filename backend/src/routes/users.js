import express from "express";
import User from "../db/user-schema.js";
import bcrypt from "bcrypt";
import { createToken } from "../auth/auth.js";
import { generateStartingPokemonForUser } from "../db/pokemon-utils.js";
import auth from "../auth/auth.js";
import Pokemon from "../db/pokemon-schema.js";

const router = express.Router();
// logi/register - https://www.youtube.com/watch?v=-8OEfGQPJ8c
// 4hr, 60min,60s,1000ms
const COOKIE_EXPIRATION = 4 * 60 * 60 * 1000;
const TOKEN_EXPIRATION = COOKIE_EXPIRATION / 1000;
// ----- Register new account -----
router.post("/register", async (req, res) => {
  // Username, email and password must be in request
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(422).send("All fields are compulsory.");

  // No duplicate usernames or emails
  let existingUsername = await User.findOne({ username });
  let existingEmail = await User.findOne({ email });
  if (existingUsername || existingEmail)
    return res.status(409).send("Email or username already exists.");

  // Encrypt password

  const encryptPass = await bcrypt.hash(password, 10);
  //Save user in database
  const user = await User.create({
    username,
    email,
    passHash: encryptPass,
    image: "",
  });

  // Genereate pokemon for user
  await generateStartingPokemonForUser(user._id);

  // Generate a token for user and send it as a cookie
  const options = {
    expires: new Date(Date.now() + COOKIE_EXPIRATION),
    httpOnly: false,
  };
  const token = createToken(user._id.toString(), username, TOKEN_EXPIRATION);
  return res
    .status(201)
    .cookie("authorization", token, options)
    .location(`/api/v1/users/${user._id}`)
    .json({ success: true });
});

router.post("/login", async (req, res) => {
  // Username and password must be in request
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(422).send("All fields are compulsory.");

  // User must exist in database
  let user = await User.findOne({ username });
  if (!user) return res.status(401).send("Username does not exist.");

  // Check if password patches
  let passwordMatched = await bcrypt.compare(password, user.passHash);
  if (!passwordMatched)
    return res.status(401).send("Incorrect password. Please try again.");

  // Create JWT token
  const token = createToken(user._id.toString(), username, TOKEN_EXPIRATION);

  // Set cookie
  const options = {
    expires: new Date(Date.now() + COOKIE_EXPIRATION),
    httpOnly: false,
  };
  return res.status(200).cookie("authorization", token, options).json({
    success: true,
  });
});

// Gets list of all users in database.
router.get("/", auth, async (req, res) => {
  const users = await User.find({});
  return res.status(200).json(users);
});

export default router;
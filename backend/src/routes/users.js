import express from "express";
import User from "../db/user-schema.js";
import bcrypt from "bcrypt";
import { createToken } from "../auth/auth.js";
import { generateStartingPokemonForUser } from "../db/pokemon-utils.js";
import auth from "../auth/auth.js";
import Pokemon from "../db/pokemon-schema.js";
import mongoose from "mongoose";

const router = express.Router();
// logi/register - https://www.youtube.com/watch?v=-8OEfGQPJ8c
// 4hr, 60min,60s,1000ms
const COOKIE_EXPIRATION = 4 * 60 * 60 * 1000;
const TOKEN_EXPIRATION = COOKIE_EXPIRATION / 1000;

// ----- REGISTER NEW ACCOUNT -----
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

// ----- LOGIN -----
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

// ----- FETCH USER'S POKEMON -----
// Gets list of pokemon belonging to user with a given id.
// if user requests a list of their own pokemon, they can specify whether all pokemon are return
// or just their favourites or just their tradeable or just their shiny
// if user request a list of other people's pokemon, it returns a list of the other person's tradeable pokemon
/**
 * @params UserID
 * @params request query: page, limit, lockedOnly, tradingOnly,
 */
router.get("/:id/pokemon", auth, async (req, res) => {
  try {
    // Check if the id exists
    const userExist = await User.findById(req.params.id);
    if (!userExist) return res.status(404).send("User can not be found.");

    // Paginations
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // Finds pokemon by specific owner
    const isSameUser = req.user._id == req.params.id;
    const isQueryLocked = req.query.lockedOnly;
    const isQueryTrading = req.query.tradingOnly;
    const isQueryShiny = req.query.shinyOnly;
    let filter = { currentOwner: new mongoose.Types.ObjectId(req.params.id) };

    if (!isSameUser) {
      filter.isTrading = true;
    } else {
      if (isQueryLocked) filter.isLocked = true;
      if (isQueryTrading) filter.isTrading = true;
      if (isQueryShiny) filter.isShiny = true;
    }
    const pokemon = await Pokemon.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("species") // Populate species information
      .populate("originalOwner", "username _id") // Populate originalOwner information
      .populate("currentOwner", "username _id"); // Populate currentOwner information

    // Count total Pokémon for pagination
    const totalCount = await Pokemon.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Check if the requested page exceeds total pages
    if (page > totalPages && totalPages > 0) {
      return res
        .status(400)
        .send(`Page ${page} exceeds the maximum of ${totalPages}.`);
    }

    return res.status(200).json({
      success: true,
      metadata: {
        totalCount: totalCount,
        page,
        totalPages,
        limit,
      },
      data: pokemon,
    });
  } catch (error) {
    console.error("Error retrieving Pokemon: ", error);
    return res
      .status(500)
      .send("Internal Server Error when retrieving Pokemon.");
  }
});

// ----- FETCH ALL USERS -----
router.get("/", auth, async (req, res) => {
  try {
    // exclude password
    const users = await User.find({}).select("-passHash");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users: ", error);
    return res.status(500).send("Internal Server Error when retrieving users.");
  }
});

// ----- FETCH SPECIFIC USER -----
router.get("/:id", auth, async (req, res) => {
  try {
    // Check if the id exists
    const userExist = await User.findById(req.params.id).select("-passHash"); // exclude password
    if (!userExist) return res.status(404).send("User can not be found.");
    return res.status(200).json(userExist);
  } catch (error) {
    console.error("Error retrieving user: ", error);
    return res
      .status(500)
      .send("Internal Server Error when retrieving user information.");
  }
});

export default router;
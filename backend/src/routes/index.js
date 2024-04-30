import express from 'express';
import user from './users.js';
import pokemon from "./pokemons.js";

const router = express.Router();
router.use("/users", user);
router.use("/pokemons", pokemon);


export default router;
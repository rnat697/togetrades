import express from 'express';
import user from './users.js';
import pokemon from "./pokemons.js";
import incubator from "./incubators.js";
import species from "./species.js";

const router = express.Router();
router.use("/users", user);
router.use("/pokemons", pokemon);
router.use("/incubators", incubator);
router.use("/species", species);


export default router;
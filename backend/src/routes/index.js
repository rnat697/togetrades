import express from 'express';
import user from './users.js';
import pokemon from "./pokemons.js";
import incubator from "./incubators.js";

const router = express.Router();
router.use("/users", user);
router.use("/pokemons", pokemon);
router.use("/incubators", incubator);


export default router;
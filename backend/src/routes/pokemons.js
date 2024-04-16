import express from "express";
import auth from "../auth/auth.js";
import {
  retrievePokemonForUser,
  retrievePokemonById,
  updateFavUserPokemon,
  updateTradeableUserPokemon,
  calculateNumTradeable,
} from "../db/pokemon-utils.js";

const router = express.Router();

// Updating the tradeable status of an owner's pokemon.
// Users can only update this field if they are the current owner of the pokemon.
// At most 6 pokemon can be listed as tradeable.
router.patch("/:id/setTradeable", auth, async (req, res) => {
  try {
    const tradeableUpdates = req.body;
    const pokemon = await retrievePokemonById(req.params.id);

    if (Object.keys(req.body).length === 0) {
      return res.status(422).send("Empty request body");
    }

    if (!pokemon) return res.status(404).send("Pokemon can not be found.");
    if (!pokemon.currentOwner.equals(req.user._id)) {
      return res.status(403).send("Pokemon is not owned by user.");
    }

    const numTradeable = await calculateNumTradeable(req.user._id);
    if (numTradeable >= 6 && !pokemon.isTradeable) {
      return res
        .status(403)
        .send(
          "Maximum tradeable Pokemon limit reached. Only 6 Pokemon can be marked as tradeable."
        );
    }
    console.log(numTradeable);
    console.log(pokemon.isTradeable);

    const update = await updateTradeableUserPokemon(
      tradeableUpdates,
      req.params.id
    );
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error updating tradeable status:", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;

import express from "express";
import auth from "../auth/auth.js";
import {
  retrievePokemonForUser,
  retrievePokemonById,
  updateFavUserPokemon,
  updateLockedPokemon,
  calculateNumTradeable,
} from "../db/pokemon-utils.js";

const router = express.Router();

// Updating the Trading status of an owner's pokemon.
// Users can only update this field if they are the current owner of the pokemon.
// Locked pokemon can't be traded.
// FIXME: @deprecated THIS WILL NOW BE A SERVERSIDE CHANGE
// router.patch("/:id/setTrading", auth, async (req, res) => {
//   try {
//     const tradingUpdates = req.body;
//     const pokemon = await retrievePokemonById(req.params.id);

//     if (Object.keys(req.body).length === 0) {
//       return res.status(422).send("Empty request body");
//     }

//     if (!pokemon) return res.status(404).send("Pokemon can not be found.");
//     if (!pokemon.currentOwner.equals(req.user._id)) {
//       return res.status(403).send("Pokemon is not owned by user.");
//     }
//     if (pokemon.isLocked) {
//       return res.status(403).send("A locked pokemon can't be tradeable.");
//     }

//     const update = await updateTradeableUserPokemon(
//       tradingUpdates,
//       req.params.id
//     );
//     return res.sendStatus(204);
//   } catch (error) {
//     console.error("Error updating tradeable status: ", error);
//     return res.status(500).send("Internal Server Error");
//   }
// });

// Updating the locked flag of an owner's pokemon.
// Users can only update this if they are the current owner of that pokemon.
// Can only lock a pokemon if it is not tradeable.
router.patch("/:id/setLocked", auth, async (req, res) => {
  try {
    const lockUpdates = req.body;
    const pokemon = await retrievePokemonById(req.params.id);

    if (Object.keys(lockUpdates).length == 0) {
      return res.status(422).send("Empty request body");
    }

    if (!pokemon) return res.status(404).send("Pokemon can not be found.");
    if (!pokemon.currentOwner.equals(req.user._id)) {
      return res.status(403).send("Pokemon is not owned by user.");
    }
    if (pokemon.isTrading) {
      return res
        .status(403)
        .send("The pokemon is in an active trade. It can not be locked.");
    }

    const update = await updateLockedPokemon(lockUpdates, req.params.id);
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error updating lock status: ", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;

import "./LockButton.css";

import { IoLockClosed } from "react-icons/io5";
import { IoLockOpenOutline } from "react-icons/io5";
import { useState } from "react";
import { toast } from "react-toastify";
import { togglePokemonLock } from "../../controllers/PokeBoxController";

export default function LockButton({ pokemonId, isPokeLocked }) {
  const [isLocked, setLock] = useState(isPokeLocked);
  const handleFavoriteClick = () => {
    togglePokemonLock(pokemonId, !isLocked)
      .then((toggledlock) => {
        setLock(toggledlock);
      })
      .catch((e) =>
        toast("Error when updating pokemon's lock status: " + e.response.data)
      );
  };
  return (
    <div className="lock-container" onClick={handleFavoriteClick}>
      {isLocked ? (
        <IoLockClosed data-testid="lock-icon-full" className="lock-icon" />
      ) : (
        <IoLockOpenOutline
          data-testid="lock-icon-outline"
          className="lock-icon"
        />
      )}
    </div>
  );
}

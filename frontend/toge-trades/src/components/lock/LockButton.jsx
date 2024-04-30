import "./LockButton.css";

import { IoLockClosed } from "react-icons/io5";
import { IoLockOpenOutline } from "react-icons/io5";
import { useState } from "react";
import { toggleLocked } from "../../api/api";
import { toast } from "react-toastify";

export default function LockButton({ pokemonId }) {
  const [isLocked, setLock] = useState(false);
  const handleFavoriteClick = () => {
    toggleLocked(pokemonId, !isLocked)
      .then((res) => setLock(!isLocked))
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

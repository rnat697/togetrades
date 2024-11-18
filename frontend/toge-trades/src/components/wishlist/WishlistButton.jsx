import styles from "./WishlistButton.module.css";
import React, { useState, useEffect } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../controllers/PokedexController";
import { toast } from "react-toastify";

export default function WishlistButton({ speciesId, isWishlisted, isMissing }) {
  const [isWished, setWished] = useState(isWishlisted);

  useEffect(() => {
    setWished(isWishlisted);
  }, [isWishlisted]);

  const handleWishClicked = () => {
    // if (!isMissing) return;
    if (isWished) {
      // Remove species from wishlist
      removeFromWishlist(speciesId).then((success) => {
        if (success) setWished(!isWished);
      });
    } else {
      // Add species to wishlist
      addToWishlist(speciesId).then((success) => {
        if (success) setWished(!isWished);
      });
    }
  };
  return (
    <div
      className={`${styles["wishlist-container"]} ${
        isMissing ? "" : styles["found-disable"]
      }`}
      onClick={handleWishClicked}
    >
      <FaRegBookmark
        className={`${styles["wishlist-icon"]} ${
          !isWished ? styles["visible"] : ""
        }`}
      />
      <FaBookmark
        className={`${styles["wishlist-icon"]} ${
          isWished ? styles["visible"] : ""
        }`}
      />
    </div>
  );
}

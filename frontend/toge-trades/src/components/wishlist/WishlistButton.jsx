import styles from "./WishlistButton.module.css";
import React, { useState, useEffect } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

export default function WishlistButton({ speciesId, isWishlisted, isMissing }) {
  const [isWished, setWished] = useState(isWishlisted);

  useEffect(() => {
    setWished(isWishlisted);
  }, [isWishlisted]);

  const handleWishClicked = () => {
    let successAPI = false;
    // TODO: ADD api call here
    if (isWished) {
      // Remove species from wishlist

      successAPI = true;
    } else {
      // Add species to wishlist

      successAPI = true;
    }
    if (successAPI) {
      setWished((prevState) => !prevState);
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

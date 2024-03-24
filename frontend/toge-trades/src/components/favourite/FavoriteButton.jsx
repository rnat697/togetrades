import "./FavoriteButton.css";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";

export default function FavoriteButton({ pokemon }) {
  const [isFavorite, setFavorite] = useState(false);
  const handleFavoriteClick = () => {
    setFavorite(!isFavorite);
  };
  return (
    <div className="favorite-container" onClick={handleFavoriteClick}>
      <FaRegHeart
        className={`${!isFavorite ? "selected-fav" : "not-selected-fav"}`}
      />
      <FaHeart
        className={`${isFavorite ? "selected-fav" : "not-selected-fav"}`}
      />
    </div>
  );
}

import "./FavoriteButton.css";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import { toggleFavorite } from "../../api/api";
import { toast } from "react-toastify";

export default function FavoriteButton({ pokemonId }) {
  const [isFavorite, setFavorite] = useState(false);
  const handleFavoriteClick = () => {
    toggleFavorite(pokemonId, !isFavorite)
      .then((res) => setFavorite(!isFavorite))
      .catch((e) =>
        toast("Error when updating favorite pokemon: " + e.response.data)
      );
  };
  return (
    <div className="favorite-container" onClick={handleFavoriteClick}>
      {isFavorite ? (
        <FaHeart className="fav-icon" />
      ) : (
        <FaRegHeart className="fav-icon" />
      )}
    </div>
  );
}

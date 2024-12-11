import { useEffect, useState } from "react";
import styles from "./TradeOfferBox.module.css";
import { getEligiblePokemonById } from "../../../controllers/ListingsController";
import { capitalizeFirstLetter } from "../../utils/utils";
import { createNewOffer } from "../../../controllers/OfferController";
import { ToastContainer } from "react-toastify";

export default function TradeOfferBox({ seeking, listingId }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [selectedPoke, setSelectedPoke] = useState({});

  // Fetch eligible pokemon
  useEffect(() => {
    getEligiblePokemonById(seeking.id).then((data) => {
      setIsEmpty(data.isEmpty);
      setPokemonList(data.pokemon);
    });
  }, [seeking.id]);

  // handle selecting a pokemon
  const handlePokeSelection = (poke) => {
    if (poke.id === selectedPoke.id) {
      setSelectedPoke({});
    } else {
      setSelectedPoke(poke);
    }
  };

  // handle selecting a pokemon
  const handleSendTradeOffer = () => {
    createNewOffer(selectedPoke.id, listingId).then((success) => {
      if (success) {
        setPokemonList(
          pokemonList.filter((pokemon) => pokemon.id !== selectedPoke.id)
        );
        setSelectedPoke({});
        if (
          pokemonList.filter((pokemon) => pokemon.id !== selectedPoke.id)
            .length < 1
        ) {
          setIsEmpty(true);
        }
      }
    });
  };

  return (
    <div className={styles["offer-box-container"]}>
      <h2>Interested in this trade?</h2>
      <p>
        {isEmpty
          ? `No pokemon found matching their request.`
          : `${pokemonList.length} Pokemon found that match what they're looking for.`}
      </p>
      <div className={styles["pokemon-to-offer-container"]}>
        {isEmpty
          ? null
          : pokemonList.map((poke) => (
              <div
                className={`${styles["poke-offer"]} ${
                  selectedPoke.id === poke.id ? styles["selected"] : ""
                }`}
                key={poke.id}
                onClick={() => handlePokeSelection(poke)}
              >
                <img
                  src={
                    poke.isShiny
                      ? poke.species.image.shiny
                      : poke.species.image.normal
                  }
                />
                <p>{capitalizeFirstLetter(poke.species.name)}</p>
              </div>
            ))}
      </div>
      <div className={styles["send-offer-button"]}>
        <button
          disabled={Object.keys(selectedPoke).length === 0}
          onClick={handleSendTradeOffer}
        >
          Send Trade Offer
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

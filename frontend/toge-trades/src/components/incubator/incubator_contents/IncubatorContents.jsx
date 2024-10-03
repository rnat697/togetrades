import { toast, ToastContainer } from "react-toastify";
import "./IncubatorContents.css";
import "ldrs/infinity";
import IncubatorCard from "../incubator_card/IncubatorCard";
import {
  deleteIncubator,
  hatchEgg,
  useIncubators,
} from "../../../controllers/IncubatorController";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import CancelModal from "../cancel_modal/CancelModal";
import PokemonModel from "../../../models/PokemonModel";
import PokemonDetails from "../../pokemon-details/PokemonDetails";

export default function IncubatorContents() {
  const [showCancelModal, setShowCancel] = useState(false);
  const [incubatorToDelete, setIncubatorToDelete] = useState(null);
  const [hatchedPoke, setHatchedPoke] = useState(null);
  const [showPoke, setShowPoke] = useState(false);
  const navigate = useNavigate();

  // ----- Get Incubators function -----
  const { incubators, isLoading, error, refresh } = useIncubators();
  if (error) toast.error(error);

  // ----- Create Incubator function -----
  const handleAddIncubatorClick = () => {
    navigate("/incubator/egg-picker");
  };
  // ----- Hatch Egg functions -----
  const handleHatchEggClick = (id) => {
    hatchEgg(id).then((data) => {
      const rawPokeData = data.pokemon;
      const pokemon = PokemonModel.fromJSON(rawPokeData);
      setHatchedPoke(pokemon);
      setShowPoke(true);
      refresh();
    });
  };
  const handlePokeModalClose = () => {
    setShowPoke(false);
    setHatchedPoke(null);
  };

  // ----- Delete Incubator functions -----
  const openCancelIncubatorModal = (id) => {
    setIncubatorToDelete(id);
    setShowCancel(true);
  };
  const handleCancelModalClose = () => {
    setShowCancel(false);
    setIncubatorToDelete(null);
  };
  const handleDeleteConfirmation = (id) => {
    deleteIncubator(id)
      .then(() => {
        setShowCancel(false);
        refresh();
      })
      .catch((err) =>
        console.error("Error handling delete confirmation:", err)
      );
  };

  return (
    <div className="incubator-contents">
      <div className="incubator-heading">
        <h1>Incubator</h1>
        <p>Hatch eggs from different types and discover new Pokemon!</p>
      </div>
      <CancelModal
        showModal={showCancelModal}
        onClose={handleCancelModalClose}
        onConfirm={() => handleDeleteConfirmation(incubatorToDelete)}
      />
      {showPoke && (
        <PokemonDetails
          pokemon={hatchedPoke}
          onClose={handlePokeModalClose}
          modalType={"incubator"}
        />
      )}
      {isLoading ? (
        <l-infinity
          size="55"
          stroke="4"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1.3"
          color="#78A7E2"
        />
      ) : (
        <div>
          <div className="incubator-subheading">
            <p>{`${incubators.length} out of 4 Incubators in use`}</p>
            <button
              onClick={() => handleAddIncubatorClick()}
              disabled={incubators.length >= 4}
            >
              Add Incubator
            </button>
          </div>
          <div className="incubators-list">
            {incubators.map((incubator) => (
              <IncubatorCard
                incubator={incubator}
                key={incubator.id}
                onHatchClick={() => handleHatchEggClick(incubator.id)}
                onCancelClick={() => openCancelIncubatorModal(incubator.id)}
              />
            ))}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

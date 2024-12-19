import "./IncubatorPage.css";
import { toast, ToastContainer } from "react-toastify";
import "ldrs/infinity";
import IncubatorCard from "../../components/incubator/incubator_card/IncubatorCard";
import {
  deleteIncubator,
  hatchEgg,
  useIncubators,
} from "../../controllers/IncubatorController";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmationModal from "../../components/confirmation_modal/ConfirmationModal";
import PokemonModel from "../../models/PokemonModel";
import PokemonDetails from "../../components/pokemon-details/PokemonDetails";

export default function IncubatorPage() {
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
      refresh();
      setShowPoke(true);
    });
  };
  const handlePokeModalClose = () => {
    setShowPoke(false);
    setTimeout(() => setHatchedPoke(null), 500);
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
  const cancelTitle = "Delete Incubator?";
  const cancelMessage =
    "Deleting this incubator will permanently remove it from your collection. This action cannot be undone.";
  const cancelActionMsg = (
    <>
      Are you sure you want to{" "}
      <span style={{ color: "red" }}>permanently delete</span> the incubation?
    </>
  );
  const cancelButtonLabel = "Delete Incubator";

  return (
    <div className="incubator-page-container">
      <div className="incubator-contents">
        <div className="incubator-heading">
          <h1>Incubator</h1>
          <p>Hatch eggs from different types and discover new Pokemon!</p>
        </div>
        <ConfirmationModal
          title={cancelTitle}
          message={cancelMessage}
          actionMessage={cancelActionMsg}
          primaryButtonLabel={cancelButtonLabel}
          isButtonRed={true}
          showModal={showCancelModal}
          onClose={handleCancelModalClose}
          onConfirm={() => handleDeleteConfirmation(incubatorToDelete)}
        />
        <PokemonDetails
          showModal={showPoke}
          pokemon={hatchedPoke}
          onClose={handlePokeModalClose}
          modalType={"incubator"}
        />
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
    </div>
  );
}

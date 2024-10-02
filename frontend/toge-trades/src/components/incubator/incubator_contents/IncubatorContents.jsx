import { toast, ToastContainer } from "react-toastify";
import "./IncubatorContents.css";
import "ldrs/infinity";
import IncubatorCard from "../incubator_card/IncubatorCard";
import {
  deleteIncubator,
  useIncubators,
} from "../../../controllers/IncubatorController";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import CancelModal from "../cancel_modal/CancelModal";

export default function IncubatorContents() {
  const [showCancelModal, setShowCancel] = useState(false);
  const [incubatorToDelete, setIncubatorToDelete] = useState(null);
  const navigate = useNavigate();
  const { incubators, isLoading, error, refresh } = useIncubators();

  if (error) toast.error(error);
  const handleAddIncubatorClick = () => {
    navigate("/incubator/egg-picker");
  };
  const handleHatchIncubatorClick = () => {};

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
                key={incubator.pokemonType}
                onHatchClick={handleHatchIncubatorClick}
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

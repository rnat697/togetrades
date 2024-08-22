import { toast, ToastContainer } from "react-toastify";
import "./IncubatorContents.css";
import "ldrs/infinity";
import IncubatorCard from "../incubator_card/IncubatorCard";
import { useIncubators } from "../../../controllers/IncubatorController";
import { NavLink, useNavigate } from "react-router-dom";

export default function IncubatorContents() {
  const navigate = useNavigate();
  const { incubators, isLoading, error, refresh } = useIncubators();
  // TODO: need to check if error messages work.
  if (error) toast.error(error);
  const handleAddIncubatorClick = () => {
    navigate("/incubator/egg-picker");
  };

  return (
    <div className="incubator-contents">
      <div className="incubator-heading">
        <h1>Incubator</h1>
        <p>Hatch eggs from different types and discover new Pokemon!</p>
      </div>
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
              />
            ))}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

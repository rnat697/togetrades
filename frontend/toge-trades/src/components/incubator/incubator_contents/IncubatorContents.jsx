import { ToastContainer } from "react-toastify";
import "./IncubatorContents.css";
import useGet from "../../../hooks/useGet";
import { USERS_INCUBATORS } from "../../../api/urls";
import "ldrs/infinity";
import IncubatorCard from "../incubator_card/IncubatorCard";

export default function IncubatorContents() {
  const {
    data: incubatorList,
    isLoading,
    refresh,
  } = useGet(USERS_INCUBATORS, [], true);
  return (
    <div className="incubator-contents">
      <div className="incubator-heading">
        <h1>Incubator</h1>
        <p>Hatch eggs from different types and discover new Pokemon!</p>
      </div>
      <div className="incubator-subheading">
        <p>{`${incubatorList.length} out of 4 Incubators in use`}</p>
        <button>Add Incubator</button>
      </div>
      <div className="incubators-list">
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
          incubatorList.map((incubator) => (
            <IncubatorCard incubator={incubator} key={incubator.pokemonType} />
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

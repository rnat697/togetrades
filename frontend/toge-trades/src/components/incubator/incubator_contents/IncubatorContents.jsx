import "./IncubatorContents.css";
import { FaPlus } from "react-icons/fa6";

export default function IncubatorContents() {
  return (
    <div className="incubator-contents">
      <div className="incubator-heading">
        <h1>Incubator</h1>
        <p>Hatch eggs from different types and discover new Pokemon!</p>
      </div>
      <div className="incubator-subheading">
        <p>3/4 Incubators in use.</p>
        <button>Add Incubator</button>
      </div>
      <div className="incubators-list"></div>
    </div>
  );
}

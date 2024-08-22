import "./IncubatorPage.css";
import GlobalNavigation from "../../components/global-navigation/GlobalNavigation";
import IncubatorContents from "../../components/incubator/incubator_contents/IncubatorContents";

export default function IncubatorPage() {
  return (
    <div className="incubator-page-container">
      <IncubatorContents />
    </div>
  );
}

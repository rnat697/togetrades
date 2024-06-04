import GlobalNavigation from "../../components/global-navigation/GlobalNavigation";
import PokeBoxContents from "../../components/pokebox/pokebox-contents/PokeBoxContents";
import "./PokeBoxPage.css";

export default function PokeBoxPage() {
  return (
    <div className="pokebox-container">
      <PokeBoxContents />
    </div>
  );
}

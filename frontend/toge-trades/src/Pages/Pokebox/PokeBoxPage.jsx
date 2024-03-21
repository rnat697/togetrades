import GlobalNavigation from "../../components/global-navigation/GlobalNavigation";
import "./PokeBoxPage.css";

export default function PokeBoxPage() {
  return (
    <div className="pokebox-container">
      <GlobalNavigation />
      <div className="box-content">
        <h1>Poke Box</h1>
      </div>
    </div>
  );
}

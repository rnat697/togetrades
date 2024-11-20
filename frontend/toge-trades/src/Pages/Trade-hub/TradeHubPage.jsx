import { useNavigate, useParams } from "react-router-dom";
import styles from "./TradeHubPage.module.css";
import NewListing from "../../components/trade-hub/new-listing/NewListing";

export default function TradeHubPage() {
  const { page } = useParams();
  const navigate = useNavigate();

  return (
    <div className={styles["trade-hub-container"]}>
      <div className={styles["trade-hub-content"]}>
        <div className={styles["trade-hub-title"]}>
          <h1>Trade Hub</h1>
          <p>Trade Pokémon to complete your Pokedex!</p>
        </div>
        <div className={styles["hub-nav"]}>
          <p>!!! Hub navs to be implemented !!!</p>
        </div>
        <div className={styles["create-listing-container"]}>
          <NewListing />
        </div>
        <div className={styles["hub-title-listings"]}>
          <h3>Recent Listings</h3>
          <button>Refresh</button>
        </div>
        <div className={styles["hub-listings"]}></div>
      </div>
    </div>
  );
}

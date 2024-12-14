import Breadcrumb from "../../components/trade-hub/breadcrumb/breadcrumb";
import styles from "./OutgoingOffersPage.module.css";

export default function OutgoingOffersPage({}) {
  return (
    <div className={styles["outgoing-offers-container"]}>
      <div className={styles["breadcrumb"]}>
        <Breadcrumb currentPageName={"Outgoing Trade Offers"} />
      </div>
      <div className={styles["header"]}>
        <h2>Outgoing Trade Offers</h2>
      </div>
    </div>
  );
}

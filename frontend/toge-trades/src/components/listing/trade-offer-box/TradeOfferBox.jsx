import styles from "./TradeOfferBox.module.css";

export default function TradeOfferBox({ seeking }) {
  return (
    <div className={styles["offer-box-container"]}>
      <h2>Interested in this trade?</h2>
      <p></p>
      <div className={styles["pokemon-to-offer-container"]}></div>
      <div className={styles["send-offer-button"]}>
        <button>Send Trade Offer</button>
      </div>
    </div>
  );
}

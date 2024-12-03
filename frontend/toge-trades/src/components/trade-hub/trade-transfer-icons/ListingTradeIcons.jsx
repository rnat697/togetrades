import { capitalizeFirstLetter } from "../../utils/utils";
import styles from "./ListingTradeIcons.module.css";
import { Tooltip } from "react-tooltip";
import { BsStars } from "react-icons/bs";

export default function TradeTransferIcons({
  offered,
  seeking,
  isSeekingShiny,
}) {
  return (
    <div className={styles["trade-transfer-icon-container"]}>
      <div className={styles["offered"]}>
        <div className={styles["image-container"]}>
          {offered.isShiny ? (
            <a
              data-tooltip-id="listing-trade-tooltips"
              data-tooltip-content="Shiny Pokemon"
            >
              <BsStars className={`${styles["shiny-star"]}`} />
            </a>
          ) : null}
          <img
            src={
              offered.isShiny
                ? offered.species.image.shiny
                : offered.species.image.normal
            }
          />
        </div>
        <p>{`Offers ${capitalizeFirstLetter(offered.species.name)}`}</p>
      </div>
      <img
        src="../../../src/assets/trade-icon.png"
        className={styles["trade-icon"]}
      />
      <div className={styles["seeking"]}>
        <div className={styles["image-container"]}>
          {isSeekingShiny ? (
            <a
              data-tooltip-id="listing-trade-tooltips"
              data-tooltip-content="Shiny Pokemon"
            >
              <BsStars className={`${styles["shiny-star"]}`} />
            </a>
          ) : null}
          <img
            src={isSeekingShiny ? seeking.image.shiny : seeking.image.normal}
          />
        </div>

        <p>{`Seeks ${capitalizeFirstLetter(seeking.name)}`}</p>
      </div>
      <Tooltip id="listing-trade-tooltips" />
    </div>
  );
}

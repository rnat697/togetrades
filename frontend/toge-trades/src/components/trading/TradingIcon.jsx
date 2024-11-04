import "./TradingIcon.css";
import { CgArrowsExchange } from "react-icons/cg";

export default function TradingIcon({ isPokeTrading }) {
  return (
    <div
      data-testid="tradeable-button"
      className={`tradeable-container ${
        isPokeTrading ? "selected-container" : ""
      }`}
    >
      <CgArrowsExchange
        className={`trade-icon ${
          isPokeTrading ? "selected-trade-icon" : "not-selected-trade-icon"
        }`}
      />
    </div>
  );
}

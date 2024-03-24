import "./TradeableButton.css";
import { useState } from "react";
import { CgArrowsExchange } from "react-icons/cg";

export default function TradeableButton() {
  const [isTradeable, setTradeable] = useState(false);
  const handleTradeableClick = () => {
    setTradeable(!isTradeable);
  };
  return (
    <div
      className={`tradeable-container ${
        isTradeable ? "selected-container" : ""
      }`}
      onClick={handleTradeableClick}
    >
      <CgArrowsExchange
        className={`trade-icon ${
          isTradeable ? "selected-trade-icon" : "not-selected-trade-icon"
        }`}
      />
    </div>
  );
}

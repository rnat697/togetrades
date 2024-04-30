import "./TradeableButton.css";
import { useState } from "react";
import { CgArrowsExchange } from "react-icons/cg";
import { toggleTradeable } from "../../api/api";
import { toast } from "react-toastify";

export default function TradeableButton({ pokemonId, isPokeTradeable }) {
  const [isTradeable, setTradeable] = useState(isPokeTradeable);
  const handleTradeableClick = () => {
    toggleTradeable(pokemonId, !isTradeable)
      .then((res) => {
        setTradeable(!isTradeable);
      })
      .catch((e) =>
        toast("Error when toggling pokemon's tradeability: " + e.response.data)
      );
  };
  return (
    <div
      data-testid="tradeable-button"
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

import { Tooltip } from "react-tooltip";
import styles from "./InfiniteScroll.module.css";
import { useState, useEffect } from "react";
import { capitalizeFirstLetter } from "../../../utils/utils";

const NUM_ITEMS_TO_LOAD = 15;

function InfiniteScroll({ items, onItemSelect }) {
  const [visibleItems, setVisibleItems] = useState(NUM_ITEMS_TO_LOAD); // Start with 10 items
  const [selectedItem, setSelectedItem] = useState(null);
  const loadMore = () => {
    setVisibleItems((prev) => prev + NUM_ITEMS_TO_LOAD);
  };
  const handleItemClick = (item) => {
    setSelectedItem(item);
    onItemSelect(item);
  };

  return (
    <div
      className={styles["infinite-scroll-container"]}
      onScroll={(e) => {
        const bottom =
          Math.round(e.target.scrollHeight - e.target.scrollTop) ===
          e.target.clientHeight;
        if (bottom) {
          loadMore();
        }
      }}
    >
      <div className={styles["scroll-grid"]}>
        {items.slice(0, visibleItems).map((item, index) => (
          <a
            data-tooltip-id="infinite-scroll-tooltip"
            data-tooltip-content={capitalizeFirstLetter(item.name)}
            key={`${item.id}-${index}`}
          >
            <div
              className={`${styles["item"]} ${
                selectedItem === item ? styles.selected : ""
              }`}
              key={`${item.name}-${index}`}
              onClick={() => handleItemClick(item)}
            >
              <img src={item.image.normal} />
            </div>
          </a>
        ))}
      </div>
      <Tooltip id="infinite-scroll-tooltip" />
    </div>
  );
}

export default InfiniteScroll;

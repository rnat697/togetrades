import styles from "./InfiniteScroll.module.css";
import { useState, useEffect } from "react";

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
          <div
            className={`${styles["item"]} ${
              selectedItem === item ? styles.selected : ""
            }`}
            key={`${item.name}-${index}`}
            onClick={() => handleItemClick(item)}
          >
            <img src={item.image.normal} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default InfiniteScroll;

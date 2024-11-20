import ListingBox from "./listing-box/ListingBox";
import styles from "./NewListing.module.css";

export default function NewListing() {
  const handleOnClicked = (isOffered) => {
    console.log("clicked, on offered? ", isOffered);
  };
  return (
    <div className={styles["new-listing-container"]}>
      <div className={styles["new-listing-content"]}>
        <div className={styles["offering-seeking-container"]}>
          <ListingBox
            title="I am Offering"
            tooltipMsg="Pick one of your eligble Pokemon that you want to offer."
            isOffering={true}
            onClicked={handleOnClicked}
          />
          <img
            className={styles["trade-icon"]}
            src="../../../src/assets/trade-icon.png"
          />
          <ListingBox
            title={"I am Seeking"}
            tooltipMsg={
              "Pick one of the Pokemon in your wishlist that you are seeking."
            }
            onClicked={handleOnClicked}
          />
        </div>
        <div className={styles["new-listing-button"]}>
          <button>Create New Listing</button>
        </div>
      </div>
    </div>
  );
}

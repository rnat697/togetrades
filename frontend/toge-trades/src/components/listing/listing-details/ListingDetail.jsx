import { formatRelativeTime } from "../../utils/utils";
import ListingEntry from "../listing-entry/ListingEntry";
import "./ListingDetail.css"; // Has to be CSS file bc overwriting the react-tabs css
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

export default function ListingDetail({ listing, metadata }) {
  return (
    <div className="listing-detail-container">
      <div className="listing-detail-header">
        <div className="listing-detail-user">
          <img src={listing.listedBy.image} />
          <p>{listing.listedBy.username}</p>
        </div>
        <h2>{`Listing #${listing.listingNum.toString().padStart(4, "0")}`}</h2>
        <p>{`Posted ${formatRelativeTime(listing.dateCreated)}`}</p>
      </div>
      <Tabs>
        <TabList>
          <Tab selectedClassName="offering-selected">Offering</Tab>
          <Tab selectedClassName="seeking-selected">Seeking</Tab>
        </TabList>
        <TabPanel>
          <ListingEntry
            pokemon={listing.offeringPokemon}
            isShiny={listing.offeringPokemon.isShiny}
            isOwned={metadata.doesOwnOffering}
          />
        </TabPanel>
        <TabPanel>
          <ListingEntry
            pokemon={listing.seekingSpecies}
            isShiny={listing.isSeekingShiny}
            isOwned={metadata.doesOwnSeeking}
            isSpecies={true}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}

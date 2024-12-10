import ListingModel from "./ListingModel";
import PokemonModel from "./PokemonModel";
import SpeciesModel from "./SpeciesModel";
import UserModel from "./UserModel";

class OffersModel {
  constructor(
    id,
    offerNum,
    offeredPokemon,
    listing,
    offeredBy,
    status,
    dateCreated,
    dateAccepted
  ) {
    this.id = id;
    this.offerNum = offerNum || null;
    this.offeredPokemon = offeredPokemon || null;
    this.listing = listing || null; // Listing Id
    this.offeredBy = offeredBy || null;
    this.status = status || null;
    this.dateCreated = new Date(dateCreated);
    this.dateAccepted = new Date(dateAccepted) || null;
  }
  static fromJSON(data) {
    if (typeof data === "object") {
      return new OffersModel(
        data._id,
        data.offerNum,
        PokemonModel.fromJSON(data.offeredPokemon),
        data.listing,
        UserModel.fromJSON(data.offeredBy),
        data.status,
        data.dateCreated,
        data.dateAccepted
      );
    } else {
      const id = data;
      return new OffersModel(id);
    }
  }
}

export default OffersModel;

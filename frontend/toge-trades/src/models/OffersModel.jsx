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
    this.offerNum = offerNum;
    this.offeredPokemon = offeredPokemon;
    this.listing = listing;
    this.offeredBy = offeredBy;
    this.status = status;
    this.dateCreated = new Date(dateCreated);
    this.dateAccepted = new Date(dateAccepted) || null;
  }
  static fromJSON(data) {
    return new OffersModel(
      data._id,
      data.offerNum,
      PokemonModel.fromJSON(data.offeredPokemon),
      ListingModel.fromJSON(data.listing),
      UserModel.fromJSON(data.offeredBy),
      data.dateCreated,
      data.status,
      data.dateAccepted
    );
  }
}

export default OffersModel;

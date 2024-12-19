import OffersModel from "./OffersModel";
import PokemonModel from "./PokemonModel";
import SpeciesModel from "./SpeciesModel";
import UserModel from "./UserModel";

class ListingModel {
  constructor(
    id,
    listingNum,
    offeringPokemon,
    seekingSpecies,
    isSeekingShiny,
    listedBy,
    dateCreated,
    status,
    offers,
    acceptedOffer
  ) {
    this.id = id;
    this.listingNum = listingNum;
    this.offeringPokemon = offeringPokemon;
    this.seekingSpecies = seekingSpecies;
    this.isSeekingShiny = isSeekingShiny;
    this.listedBy = listedBy;
    this.dateCreated = new Date(dateCreated);
    this.status = status;
    this.offers = offers || [];
    this.acceptedOffer = acceptedOffer || null;
  }
  static fromJSON(data) {
    let acceptedOffer = null;
    let offers = [];
    if (data.acceptedOffer) {
      acceptedOffer = OffersModel.fromJSON(data.acceptedOffer);
    }
    if (data.offers.length > 0) {
      offers = data.offers.map((item) => OffersModel.fromJSON(item.offer));
    }
    return new ListingModel(
      data._id,
      data.listingNum,
      PokemonModel.fromJSON(data.offeringPokemon),
      SpeciesModel.fromJSON(data.seekingSpecies),
      data.isSeekingShiny,
      UserModel.fromJSON(data.listedBy),
      data.dateCreated,
      data.status,
      offers,
      acceptedOffer
    );
  }
}

export default ListingModel;

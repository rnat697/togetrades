import SpeciesModel from "./SpeciesModel";
import UserModel from "./UserModel";

class PokemonModel {
  constructor(
    id,
    species,
    orignOwner,
    currentOwner,
    isShiny,
    isTrading,
    isLocked
  ) {
    this.id = id;
    this.species = species;
    this.originalOwner = orignOwner;
    this.currentOwner = currentOwner;
    this.isShiny = isShiny;
    this.isTrading = isTrading; // Changed from Tradeable to Trading (True if in active trade, false if not)
    this.isLocked = isLocked;
  }
  static fromJSON(data) {
    return new PokemonModel(
      data._id,
      SpeciesModel.fromJSON(data.species),
      UserModel.fromJSON(data.originalOwner),
      UserModel.fromJSON(data.currentOwner),
      data.isShiny,
      data.isTradeable,
      data.isLocked
    );
  }
}
export default PokemonModel;

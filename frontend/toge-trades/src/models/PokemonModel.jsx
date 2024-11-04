import SpeciesModel from "./SpeciesModel";
import UserModel from "./UserModel";

class PokemonModel {
  constructor(
    id,
    species,
    orignOwner,
    currentOwner,
    isShiny,
    isTradeable,
    isLocked
  ) {
    this.id = id;
    this.species = species;
    this.originalOwner = orignOwner;
    this.currentOwner = currentOwner;
    this.isShiny = isShiny;
    this.isTradeable = isTradeable;
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

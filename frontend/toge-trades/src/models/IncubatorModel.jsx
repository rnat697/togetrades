class IncubatorModel {
  constructor(id, hatcher, hatchTime, isLegendary, pokemonType) {
    this.id = id;
    this.hatcher = hatcher;
    this.hatchTime = new Date(hatchTime);
    this.isLegendary = isLegendary;
    this.pokemonType = pokemonType;
  }
  static fromJSON(data) {
    return new IncubatorModel(
      data._id,
      data.hatcher,
      data.hatchTime,
      data.isLegendary,
      data.pokemonType
    );
  }
}

export default IncubatorModel;

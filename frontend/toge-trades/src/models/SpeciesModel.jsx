class SpeciesModel {
  constructor(
    id,
    dexNumber,
    dexEntry,
    name,
    types,
    height,
    weight,
    isLegendary,
    image
  ) {
    this.id = id;
    this.dexNumber = dexNumber;
    this.dexEntry = dexEntry;
    this.name = name;
    this.types = types;
    this.height = height;
    this.weight = weight;
    this.isLegendary = isLegendary;
    this.image = image;
  }
  static fromJSON(data) {
    return new SpeciesModel(
      data._id,
      data.dexNumber,
      data.dexEntry,
      data.name,
      data.types,
      data.height,
      data.weight,
      data.isLegendary,
      data.image
    );
  }
}
export default SpeciesModel;

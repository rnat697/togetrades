import Species from "../../../../backend/src/db/species-schema";

class UserModel {
  constructor(id, username, email, image, wishlist) {
    this.id = id;
    this.username = username;
    this.email = email || null;
    this.image = image || null;
    this.wishlist = wishlist
      ? wishlist.map((species) => Species.fromJSON(species))
      : [];
  }
  static fromJSON(data) {
    if (typeof data === "object") {
      return new UserModel(
        data._id,
        data.username,
        data.email,
        data.image,
        data.wishlist
      );
    } else {
      const id = data;
      return new UserModel(id);
    }
  }
}
export default UserModel;

class UserModel {
  constructor(id, username, email, image) {
    this.id = id;
    this.username = username;
    this.email = email || null;
    this.image = image || null;
  }
  static fromJSON(data) {
    return new UserModel(data._id, data.username, data.email, data.image);
  }
}
export default UserModel;

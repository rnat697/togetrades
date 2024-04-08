const testUser = {
  _id: "000000000000000000000002",
  username: "testuser",
  email: "testemail@email.com",
  image:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png",
};

const mockTestPayload = {
  _id: testUser._id,
  username: testUser.username,
  exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expiration time: current time + 1 hour
};
// Encode payload as base64 (JWT tokens are base64 encoded)
const testToken = Buffer.from(JSON.stringify(mockTestPayload)).toString(
  "base64"
);

const lynneyUser = {
  _id: "000000000000000000000001",
  username: "Lynney",
  email: "lynney@email.com",
  image:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png",
};
// Mock token payload
const mockLynneyPayload = {
  _id: lynneyUser._id,
  username: lynneyUser.username,
  exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expiration time: current time + 1 hour
};

// Encode payload as base64 (JWT tokens are base64 encoded)
const lynneyToken = Buffer.from(JSON.stringify(mockLynneyPayload)).toString(
  "base64"
);

export {
  testUser,
  lynneyUser,
  mockTestPayload,
  mockLynneyPayload,
  testToken,
  lynneyToken,
};

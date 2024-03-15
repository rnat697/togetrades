import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import routes from "../users.js";
import jwt from "jsonwebtoken";
import { addAllMockData } from "../__mocks__/mock_data.js";

let mongod, db;
const app = express();
app.use(express.json());
app.use("/api/v1/users", routes);

// Start in-memory DB before tests run
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const connectionString = mongod.getUri();
  mongoose.set("strictQuery", false);
  await mongoose.connect(connectionString);
  db = mongoose.connection.db;
});

// Add mock data before each test
beforeEach(async () => {
  await addAllMockData();
});

// Stop in-memory DB when complete
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

function extractTokenFromCookie(res) {
  const cookies = res.headers["set-cookie"];
  if (!cookies) {
    throw new Error("No cookies set in response");
  }

  for (const cookie of cookies) {
    const match = cookie.match(/authorization=([^;]*)/);
    if (match) {
      return match[1];
    }
  }

  throw new Error("No authorization cookie found in response");
}

// ------- Account Registration Tests -------
describe("Account Registration POST /api/v1/users/register", () => {
  test("Successful account registration", (done) => {
    request(app)
      .post("/api/v1/users/register")
      .send({
        username: "Lynette",
        email: "lynette@email.com",
        password: "passw0rd1",
      })
      .expect(201)
      .end(async (err, res) => {
        if (err) return done(err);

        // Check if user is in database
        const dbUser = await db
          .collection("users")
          .findOne({ username: "Lynette" });
        expect(dbUser).toBeDefined;

        // Check if _id in database match location header
        expect(res.header.location).toBe(`/api/v1/users/${dbUser._id}`);

        // Check if JWT token validate and contain correct username
        const token = jwt.verify(
          extractTokenFromCookie(res),
          process.env.JWT_KEY
        );
        expect(token.username).toBe("Lynette");

        return done();
      });
  });

  test("Starter pokemon are genereated when account registration is successful", (done) => {
    request(app)
      .post("/api/v1/users/register")
      .send({
        username: "Lynette",
        email: "lynette@email.com",
        password: "passw0rd1",
      })
      .expect(201)
      .end(async (err, res) => {
        if (err) return done(err);

        // Check if there are 12 starter pokemon for new user in database
        const userID = res.header.location.slice(
          res.header.location.lastIndexOf("/") + 1
        );
        const numPokemon = await mongoose.connection.db
          .collection("pokemons")
          .countDocuments({
            currentOwner: new mongoose.Types.ObjectId(userID),
          });
        expect(numPokemon).toBe(12);
        return done();
      });
  });

  test("Duplicate username - Account registration fails with HTTP 409", (done) => {
    request(app)
      .post("/api/v1/users/register")
      .send({
        username: "Lynney",
        email: "Lynney23@email.com",
        password: "dupeusername",
      })
      .expect(409, done);
  });

  test("Duplicate email - Account registration fails with HTTP 409", (done) => {
    request(app)
      .post("/api/v1/users/register")
      .send({
        username: "Lynney123",
        email: "lynney@email.com",
        password: "dupeemail",
      })
      .expect(409, done);
  });

  test("Missing username - Account registration fails with HTTP 422", (done) => {
    request(app)
      .post("/api/v1/users/register")
      .send({
        username: "",
        email: "lynney@email.com",
        password: "dupeemail",
      })
      .expect(422, done);
  });

  test("Missing email - Account registration fails with HTTP 422", (done) => {
    request(app)
      .post("/api/v1/users/register")
      .send({
        username: "Lynney",
        email: "",
        password: "dupeemail",
      })
      .expect(422, done);
  });

  test("Missing password - Account registration fails with HTTP 422", (done) => {
    request(app)
      .post("/api/v1/users/register")
      .send({
        username: "Lynney",
        email: "lynney@email.com",
        password: "",
      })
      .expect(422, done);
  });
});

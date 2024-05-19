import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import routes from "../incubators.js";
import {
  addAllMockData,
  bearerLynney,
  bearerNavia,
  bearerVenti,
  pokemonLynneysIvyasaur,
  pokemonNaviasIvysaur,
  pokemonNaviasLunala,
  pokemonVentisIvyasaur,
  speciesIvysaur,
  speciesLunala,
  userLynney,
  userNavia,
  userVenti,
  ventisIncubatorGhost,
  ventisIncubatorGrass,
} from "../__mocks__/mock_data.js";

let mongod, db;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/incubators", routes);

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

// ---------------- Incubator Fetching ----------------
describe("Incubator Fetch GET /api/v1/incubators/", () => {
  test("Successful fetching of incubators", (done) => {
    request(app)
      .get("/api/v1/incubators/")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let incubators = res.body;
        expect(incubators.length).toBe(4);
        expect(incubators[0]._id).toBe(ventisIncubatorGhost._id.toString());
        expect(incubators[1]._id).toBe(ventisIncubatorGrass._id.toString());

        return done();
      });
  });
  test("Successful fetching of no incubators when user doesn't have any", (done) => {
    request(app)
      .get("/api/v1/incubators/")
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let incubators = res.body;
        expect(incubators.length).toBe(0);

        return done();
      });
  });
});

// ---------------- Incubator Creation ----------------
describe("Incubator Creation POST /api/v1/incubators/:type/create", () => {
  test("Successful creation of incubator for grass type eggs", (done) => {
    request(app)
      .post("/api/v1/incubators/grass/create")
      .set("Cookie", [`authorization=${bearerLynney}`])
      .send()
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        let { success, incubator } = res.body;
        expect(success).toBe(true);
        console.log(incubator);
        expect(incubator.pokemonType).toBe("grass");
        return done();
      });
  });
  test("Maximum incubator limit (HTTP 403) - can't add anymore incubators", (done) => {
    request(app)
      .post("/api/v1/incubators/grass/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send()
      .expect(403)
      .end(done);
  });
});

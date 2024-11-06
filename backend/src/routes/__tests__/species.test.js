import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import routes from "../species.js";
import {
  addAllMockData,
  bearerNavia,
  pokemonNaviasIvysaur,
  pokemonNaviasLunala,
  speciesIvysaur,
  speciesLunala,
  speciesShaymin,
  speciesOddish,
  userLynney,
  userNavia,
  userVenti,
} from "../__mocks__/mock_data.js";

let mongod, db;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/species", routes);

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

describe("Getting species list with pagination, GET /api/v1/species/ ", () => {
  test("Successful fetching of first page of species with isMissing fields", (done) => {
    request(app)
      .get("/api/v1/species/")
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);

        // Check meta data
        const response = res.body;
        expect(response.success).toBe(true);
        expect(response.metadata.totalCount).toBe(4);
        expect(response.metadata.page).toBe(1);
        expect(response.metadata.totalPages).toBe(1);
        expect(response.metadata.limit).toBe(20);

        const species = response.data;
        expect(species.length).toBe(4);
        expect(species[0]._id).toBe(speciesShaymin._id.toString());
        expect(species[1]._id).toBe(speciesIvysaur._id.toString());
        expect(species[0].isMissing).toBe(true);
        expect(species[1].isMissing).toBe(false);
        expect(species[3].isMissing).toBe(true);

        return done();
      });
  });
});

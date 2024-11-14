import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import routes from "../species.js";
import {
  addAllMockData,
  bearerNavia,
  speciesIvysaur,
  speciesBulbasaur,
  speciesVenusaur,
  speciesShaymin,
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
        expect(response.metadata.totalCount).toBe(6);
        expect(response.metadata.page).toBe(1);
        expect(response.metadata.totalPages).toBe(1);
        expect(response.metadata.limit).toBe(20);

        const species = response.data;
        expect(species.length).toBe(6);
        expect(species[3]._id).toBe(speciesShaymin._id.toString());
        expect(species[1]._id).toBe(speciesIvysaur._id.toString());
        expect(species[0].isMissing).toBe(true);
        expect(species[1].isMissing).toBe(false);
        expect(species[2].isMissing).toBe(true);

        return done();
      });
  });
  test("Unsuccessful pagination - 2nd page attempt, total pages 1", (done) => {
    request(app)
      .get(`/api/v1/species/?page=2`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(400)
      .end(done);
  });
});

describe("Getting singular species, GET /api/v1/species/item/:dexNumber ", () => {
  test("Successful fetching of ivysaur with isMissing fields", (done) => {
    request(app)
      .get(`/api/v1/species/item/${speciesIvysaur.dexNumber}`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);

        // Check meta data
        const response = res.body;
        expect(response.success).toBe(true);
        expect(response.metadata.next._id).toBe(speciesVenusaur._id.toString());
        expect(response.metadata.previous._id).toBe(
          speciesBulbasaur._id.toString()
        );

        const species = response.data;
        expect(species._id).toBe(speciesIvysaur._id.toString());
        expect(species.isMissing).toBe(false);

        return done();
      });
  });
  test("Successful fetching of bulbasaur, previous is null ", (done) => {
    request(app)
      .get(`/api/v1/species/item/${speciesBulbasaur.dexNumber}`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);

        // Check meta data
        const response = res.body;
        expect(response.success).toBe(true);
        expect(response.metadata.next._id).toBe(speciesIvysaur._id.toString());
        expect(response.metadata.previous).toBe(null);

        const species = response.data;
        expect(species._id).toBe(speciesBulbasaur._id.toString());
        expect(species.isMissing).toBe(true);

        return done();
      });
  });
  test("Species not found", (done) => {
    request(app)
      .get(`/api/v1/species/item/-1`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(404)
      .end(done);
  });
  test("User unauthorised", (done) => {
    request(app)
      .get(`/api/v1/species/item/2035`)
      .set("Cookie", [`authorization=`])
      .send()
      .expect(401)
      .end(done);
  });
});

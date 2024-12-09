import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import routes from "../offers.js";
import {
  addAllMockData,
  bearerAgatha,
  bearerNavia,
  bearerVenti,
  listingIvyForLunaLynney,
  pokemonAgathasLockedLunala,
  pokemonNaviasIvysaur,
  pokemonNaviasLunala,
  pokemonVentisIvyasaur,
  pokemonVentisLunalaTradeable,
} from "../__mocks__/mock_data.js";

let mongod, db;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/offers", routes);

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

// ---------------- Offer Creation ----------------
describe("Offer creation POST /api/v1/offers/create", () => {
  test("Successful creation of an offer", (done) => {
    request(app)
      .post("/api/v1/offers/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: pokemonVentisLunalaTradeable._id,
        listingId: listingIvyForLunaLynney._id,
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        let data = res.body;
        expect(data.success).toBe(true);
        expect(data.message).toBe("Offer created successfully.");
        return done();
      });
  });
  test("No offered Pokemon ID sent, 400 Code", (done) => {
    request(app)
      .post("/api/v1/offers/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        listingId: listingIvyForLunaLynney._id,
      })
      .expect(400)
      .end(done);
  });
  test("No listing ID sent, 400 Code", (done) => {
    request(app)
      .post("/api/v1/offers/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: pokemonVentisIvyasaur._id,
      })
      .expect(400)
      .end(done);
  });
  test("Pokemon can't be found, 404 Code", (done) => {
    request(app)
      .post("/api/v1/offers/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: "000000000000000000000054",
        listingId: listingIvyForLunaLynney._id,
      })
      .expect(404)
      .end(done);
  });
  test("Listing can't be found, 404 Code", (done) => {
    request(app)
      .post("/api/v1/offers/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: pokemonVentisLunalaTradeable._id,
        listingId: "000000000000000000000054",
      })
      .expect(404)
      .end(done);
  });

  test("Pokemon has been traded before, 400 Code", (done) => {
    request(app)
      .post("/api/v1/offers/create")
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send({
        offeredPokeId: pokemonNaviasLunala._id,
        listingId: listingIvyForLunaLynney._id,
      })
      .expect(400)
      .end(done);
  });
  test("Pokemon is locked, 423 Code", (done) => {
    request(app)
      .post("/api/v1/offers/create")
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send({
        offeredPokeId: pokemonAgathasLockedLunala._id,
        listingId: listingIvyForLunaLynney._id,
      })
      .expect(423)
      .end(done);
  });

  test("Pokemon is not the same species as sought in listing, 400 Code", (done) => {
    request(app)
      .post("/api/v1/offers/create")
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send({
        offeredPokeId: pokemonNaviasIvysaur._id,
        listingId: listingIvyForLunaLynney._id,
      })
      .expect(400)
      .end(done);
  });
});

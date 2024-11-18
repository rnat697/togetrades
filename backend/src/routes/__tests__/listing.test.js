import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import routes from "../listing.js";
import {
  addAllMockData,
  bearerLynney,
  bearerNavia,
  bearerVenti,
  pokemonNaviasIvysaur,
  pokemonNaviasLunala,
  pokemonVentisIvyasaur,
  pokemonVentisLunala,
  speciesLunala,
  speciesOddish,
  userNavia,
  userVenti,
  ventisIncubatorGhost,
  ventisIncubatorGrass,
} from "../__mocks__/mock_data.js";

let mongod, db;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/listing", routes);

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

// ---------------- Listing Creation ----------------
describe("Listing creation POST /api/v1/listing/create", () => {
  test("Successful creation of Listing", (done) => {
    request(app)
      .post("/api/v1/listing/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: pokemonVentisIvyasaur._id,
        seekSpeciesId: userVenti.wishlist[0].species._id,
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        let data = res.body;
        expect(data.success).toBe(true);
        expect(data.message).toBe("Listing created successfully");
        return done();
      });
  });
  test("No offered Pokemon ID sent, 400 Code", (done) => {
    request(app)
      .post("/api/v1/listing/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        seekSpeciesId: userVenti.wishlist[0].species._id,
      })
      .expect(400)
      .end(done);
  });
  test("No seeking species ID sent, 400 Code", (done) => {
    request(app)
      .post("/api/v1/listing/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: pokemonVentisIvyasaur._id,
      })
      .expect(400)
      .end(done);
  });
  test("Pokemon can't be found, 404 Code", (done) => {
    request(app)
      .post("/api/v1/listing/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: "000000000000000000000054",
        seekSpeciesId: userVenti.wishlist[0].species._id,
      })
      .expect(404)
      .end(done);
  });
  test("Species can't be found, 404 Code", (done) => {
    request(app)
      .post("/api/v1/listing/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: pokemonVentisIvyasaur._id,
        seekSpeciesId: "000000000000000000000054",
      })
      .expect(404)
      .end(done);
  });
  test("Pokemon in active trade, 409 Code", (done) => {
    request(app)
      .post("/api/v1/listing/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: pokemonVentisLunala._id,
        seekSpeciesId: userVenti.wishlist[0].species._id,
      })
      .expect(409)
      .end(done);
  });
  test("Pokemon has been traded before, 400 Code", (done) => {
    request(app)
      .post("/api/v1/listing/create")
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send({
        offeredPokeId: pokemonNaviasLunala._id,
        seekSpeciesId: userNavia.wishlist[0].species._id,
      })
      .expect(400)
      .end(done);
  });
  test("Pokemon is locked, 423 Code", (done) => {
    request(app)
      .post("/api/v1/listing/create")
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send({
        offeredPokeId: pokemonNaviasIvysaur._id,
        seekSpeciesId: userNavia.wishlist[0].species._id,
      })
      .expect(423)
      .end(done);
  });
  test("Species is not in user's wishlist, 404 Code", (done) => {
    request(app)
      .post("/api/v1/listing/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: pokemonVentisIvyasaur._id,
        seekSpeciesId: speciesOddish._id,
      })
      .expect(404)
      .end(done);
  });
});

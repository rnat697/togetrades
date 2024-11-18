import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import routes from "../pokemons.js";
import {
  addAllMockData,
  bearerAgatha,
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
} from "../__mocks__/mock_data.js";

let mongod, db;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/pokemons", routes);

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

// ------- Lock Pokemon Toggling -------
describe("Lock Pokemon Toggling PATCH /api/v1/pokemons/id/setLocked", () => {
  test("Successful setting a pokemon as locked", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonVentisIvyasaur._id}/setLocked`)
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        isLocked: true,
      })
      .expect(204)
      .end(async (err, res) => {
        if (err) return done(err);

        const fromDb = await mongoose.connection.db
          .collection("pokemons")
          .findOne({ _id: pokemonVentisIvyasaur._id });
        expect(fromDb.isLocked).toBe(true);
        return done();
      }, 10000);
  });

  test("Successful unlocking a locked pokemon", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonLynneysIvyasaur._id}/setLocked`)
      .set("Cookie", [`authorization=${bearerLynney}`])
      .send({
        isLocked: false,
      })
      .expect(204)
      .end(async (err, res) => {
        if (err) return done(err);

        const fromDb = await mongoose.connection.db
          .collection("pokemons")
          .findOne({ _id: pokemonLynneysIvyasaur._id });
        expect(fromDb.isLocked).toBe(false);
        return done();
      });
  });

  test("No body sent (HTTP 422) - can't change locked status", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonNaviasLunala._id}/setLocked`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(422)
      .end(done);
  });
  test("Not the owner of the pokemon (HTTP 403) - can't change locked", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonNaviasLunala._id}/setLocked`)
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({ isLocked: false })
      .expect(403)
      .end(done);
  });
  test("Pokemon doesn't exist (HTTP 404) - can't change locked", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/000000000000000000500009/setLocked`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send({ isLocked: false })
      .expect(404)
      .end(done);
  });

  test("Pokemon is in active trade (HTTP 403) - can't be locked", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonNaviasIvysaur._id}/setLocked`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send({ isLocked: true })
      .expect(403)
      .end(done);
  });

  test("User not authenticated (HTTP 401) - can't change locked", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonNaviasLunala._id}/setLocked`)
      .send({ isLocked: false })
      .expect(401)
      .end(done);
  });
});

describe("Fetching all eligible pokemons for trade offering GET /api/v1/pokemons/all-eligible-pokemon", () => {
  test("Successful fetch of elegible pokemons for trade offering (small)", (done) => {
    request(app)
      .get("/api/v1/pokemons/all-eligible-pokemon")
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);
        let metadata = response.metadata;
        expect(metadata.totalCount).toBe(5);
        expect(metadata.totalPages).toBe(1);
        let pokemon = response.data;
        expect(pokemon.length).toBe(5);
        return done();
      });
  });
  test("Successful fetch of elegible pokemons for trade offering (large)", (done) => {
    request(app)
      .get("/api/v1/pokemons/all-eligible-pokemon")
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);
        let metadata = response.metadata;
        expect(metadata.totalCount).toBe(50);
        expect(metadata.totalPages).toBe(3);

        let pokemon = response.data;
        expect(pokemon.length).toBe(24);
        return done();
      });
  });
  test("Successful fetch of elegible pokemons for trade offering Page 2", (done) => {
    request(app)
      .get("/api/v1/pokemons/all-eligible-pokemon?page=2")
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);
        let metadata = response.metadata;
        expect(metadata.totalCount).toBe(50);
        expect(metadata.page).toBe(2);

        let pokemon = response.data;
        expect(pokemon.length).toBe(24);
        return done();
      });
  });
  test("Successful fetch of elegible pokemons for trade offering, Last Page", (done) => {
    request(app)
      .get("/api/v1/pokemons/all-eligible-pokemon?page=3")
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);
        let metadata = response.metadata;
        expect(metadata.totalCount).toBe(50);
        expect(metadata.page).toBe(3);

        let pokemon = response.data;
        expect(pokemon.length).toBe(2);
        return done();
      });
  });
  test("Outside of page scope, >totalPages", (done) => {
    request(app)
      .get("/api/v1/pokemons/all-eligible-pokemon?page=4")
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(400)
      .end(done);
  });
  test("Outside of page scope, <=0", (done) => {
    request(app)
      .get("/api/v1/pokemons/all-eligible-pokemon?page=-1")
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(400)
      .end(done);
  });
});

describe("Fetching specific species of eligible pokemons for trade offering GET /api/v1/pokemons/elegible-pokemon/:id", () => {
  test("Successful fetch of specific species (elegible pokemons) for trade offering", (done) => {
    request(app)
      .get(`/api/v1/pokemons/elegible-pokemon/${speciesLunala._id}`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);
        console.log(response);
        let pokemon = response.data;
        expect(pokemon.length).toBe(2);

        let isEmpty = response.isEmpty;
        expect(isEmpty).toBe(false);
        return done();
      });
  });
  test("Invalid species", (done) => {
    request(app)
      .get(`/api/v1/pokemons/elegible-pokemon/000000000000000000000592`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(404)
      .end(done);
  });
});

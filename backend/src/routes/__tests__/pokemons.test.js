import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import routes from "../pokemons.js";
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

// ------- Pokemon Tradeable Toggling -------
describe("Pokemon Tradeable Toggling PATCH /api/v1/pokemons/id/setTradeable", () => {
  test("Successful setting tradeablility of a pokemon", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonVentisIvyasaur._id}/setTradeable`)
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        isTradeable: true,
      })
      .expect(204)
      .end(async (err, res) => {
        if (err) return done(err);

        const fromDb = await mongoose.connection.db
          .collection("pokemons")
          .findOne({ _id: pokemonVentisIvyasaur._id });
        expect(fromDb.isTradeable).toBe(true);
        return done();
      }, 10000);
  });

  test("Successful removing tradeablility of a pokemon", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonNaviasIvysaur._id}/setTradeable`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send({
        isTradeable: false,
      })
      .expect(204)
      .end(async (err, res) => {
        if (err) return done(err);

        const fromDb = await mongoose.connection.db
          .collection("pokemons")
          .findOne({ _id: pokemonNaviasIvysaur._id });
        expect(fromDb.isTradeable).toBe(false);
        return done();
      });
  });

  test("No body sent (HTTP 422) - can't change tradeable status", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonNaviasLunala._id}/setTradeable`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(422)
      .end(done);
  });
  test("Not the owner of the pokemon (HTTP 403) - can't change tradeable", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonNaviasLunala._id}/setTradeable`)
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({ isTradeable: false })
      .expect(403)
      .end(done);
  });
  test("Pokemon doesn't exist (HTTP 404) - can't change tradeable", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/000000000000000000500009/setTradeable`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send({ isTradeable: false })
      .expect(404)
      .end(done);
  });

  test("User not authenticated (HTTP 401) - can't change tradeable", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonNaviasLunala._id}/setTradeable`)
      .send({ isTradeable: false })
      .expect(401)
      .end(done);
  });

  test("Maximum tradeable Pokemon limit reached (HTTP 403) - can't add more pokemon to be tradeable", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonNaviasLunala._id}/setTradeable`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send({ isTradeable: true })
      .expect(403)
      .end(done);
  });
  test("Maximum tradeable Pokemon limit reached BUT pokemon is already tradeable and want to remove it HTTP(204) ", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/${pokemonNaviasIvysaur._id}/setTradeable`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send({ isTradeable: false })
      .expect(204)
      .end(done);
  });
});

// ------- Favorite Pokemon Toggling -------
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
      .send({ isFavorite: false })
      .expect(403)
      .end(done);
  });
  test("Pokemon doesn't exist (HTTP 404) - can't change locked", (done) => {
    request(app)
      .patch(`/api/v1/pokemons/000000000000000000500009/setLocked`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send({ isFavorite: false })
      .expect(404)
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

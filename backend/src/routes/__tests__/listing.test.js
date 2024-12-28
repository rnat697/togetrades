import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import routes from "../listing.js";
import {
  addAllMockData,
  bearerAgatha,
  bearerLynney,
  bearerNavia,
  bearerVenti,
  listingIvyForBulbVenti,
  pokemonNaviasIvysaur,
  pokemonNaviasLunala,
  pokemonVentisIvyasaur,
  pokemonVentisLunala,
  speciesLunala,
  speciesOddish,
  userAgatha,
  userNavia,
  userVenti,
  ventisIncubatorGhost,
  ventisIncubatorGrass,
} from "../__mocks__/mock_data.js";

let mongod, db;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/listings", routes);

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
      .post("/api/v1/listings/create")
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
      .post("/api/v1/listings/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        seekSpeciesId: userVenti.wishlist[0].species._id,
      })
      .expect(400)
      .end(done);
  });
  test("No seeking species ID sent, 400 Code", (done) => {
    request(app)
      .post("/api/v1/listings/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: pokemonVentisIvyasaur._id,
      })
      .expect(400)
      .end(done);
  });
  test("Pokemon can't be found, 404 Code", (done) => {
    request(app)
      .post("/api/v1/listings/create")
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
      .post("/api/v1/listings/create")
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
      .post("/api/v1/listings/create")
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
      .post("/api/v1/listings/create")
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
      .post("/api/v1/listings/create")
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
      .post("/api/v1/listings/create")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send({
        offeredPokeId: pokemonVentisIvyasaur._id,
        seekSpeciesId: speciesOddish._id,
      })
      .expect(404)
      .end(done);
  });
});
// ---------------- FETCH RECENT LISTINGS  ----------------
describe("Fetch recent listings GET /api/v1/listing/", () => {
  test("Successful fetching of recent listings", (done) => {
    request(app)
      .get("/api/v1/listings/")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);

        let metadata = response.metadata;
        expect(metadata.totalCount).toBe(34);
        expect(metadata.page).toBe(1);
        expect(metadata.totalPages).toBe(4);
        expect(metadata.limit).toBe(10);

        // Check if its in descending order
        let listings = response.data;
        expect(listings.length).toBe(10);
        for (let i = 34; i > 34 - 10; i--) {
          expect(listings[34 - i].listingNum).toBe(i);
        }
        return done();
      });
  });
  test("Successful fetching of recent listings, Page 4", (done) => {
    request(app)
      .get("/api/v1/listings/?page=4")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);

        let metadata = response.metadata;
        expect(metadata.totalCount).toBe(34);
        expect(metadata.page).toBe(4);
        expect(metadata.totalPages).toBe(4);
        expect(metadata.limit).toBe(10);

        // Check if its in descending order
        let listings = response.data;
        expect(listings.length).toBe(4);
        for (let i = 4; i > 0; i--) {
          expect(listings[4 - i].listingNum).toBe(i);
        }
        return done();
      });
  });
  test("fetching recent listing out of scope, Page 5", (done) => {
    request(app)
      .get("/api/v1/listings/?page=5")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send()
      .expect(400)
      .end(done);
  });

  test("Successful fetching of user's listings - two listings", (done) => {
    request(app)
      .get(`/api/v1/listings/?userId=${userNavia._id}`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);

        let metadata = response.metadata;
        expect(metadata.totalCount).toBe(2);
        expect(metadata.page).toBe(1);
        expect(metadata.totalPages).toBe(1);
        expect(metadata.limit).toBe(10);

        let listings = response.data;
        expect(listings[0].listingNum).toBe(4);
        expect(listings[1].listingNum).toBe(2);

        return done();
      });
  });
  test("Successful fetching of user's listings - 30 listings", (done) => {
    request(app)
      .get(`/api/v1/listings/?userId=${userAgatha._id}`)
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);

        let metadata = response.metadata;
        expect(metadata.totalCount).toBe(30);
        expect(metadata.page).toBe(1);
        expect(metadata.totalPages).toBe(3);
        expect(metadata.limit).toBe(10);

        let listings = response.data;
        for (let i = 34; i > 34 - 10; i--) {
          expect(listings[34 - i].listingNum).toBe(i);
        }

        return done();
      });
  });

  test("Successful fetching of user's 30 listings - page 2", (done) => {
    request(app)
      .get(`/api/v1/listings/?userId=${userAgatha._id}&page=2`)
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);

        let metadata = response.metadata;
        expect(metadata.totalCount).toBe(30);
        expect(metadata.page).toBe(2);
        expect(metadata.totalPages).toBe(3);
        expect(metadata.limit).toBe(10);

        let listings = response.data;
        for (let i = 24; i > 24 - 10; i--) {
          expect(listings[24 - i].listingNum).toBe(i);
        }

        return done();
      });
  });

  test("fetching user's listings out of scope, Page 4", (done) => {
    request(app)
      .get(`/api/v1/listings/?userId=${userAgatha._id}&page=4`)
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(400)
      .end(done);
  });
});

// ---------------- FETCH SPECIFIC LISTING  ----------------
describe("Fetch specific listings GET /api/v1/listing/:listingId", () => {
  test("Successful fetching of a listing", (done) => {
    request(app)
      .get(`/api/v1/listings/${listingIvyForBulbVenti._id}`)
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);

        let listing = response.data;
        expect(listing.listingNum).toBe(1);
        expect(listing.offeringPokemon.species.name).toBe("ivysaur");
        expect(listing.seekingSpecies.name).toBe("bulbasaur");
        expect(listing.isSeekingShiny).toBe(true);
        expect(listing.listedBy.username).toBe("Venti");
        expect(listing.status).toBe("Active");

        return done();
      });
  });
  test("Successful fetching of a listing, other people viewing venti's", (done) => {
    request(app)
      .get(`/api/v1/listings/${listingIvyForBulbVenti._id}`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let response = res.body;
        expect(response.success).toBe(true);

        let listing = response.data;
        expect(listing.listingNum).toBe(1);
        expect(listing.offeringPokemon.species.name).toBe("ivysaur");
        expect(listing.seekingSpecies.name).toBe("bulbasaur");
        expect(listing.isSeekingShiny).toBe(true);
        expect(listing.listedBy.username).toBe("Venti");
        expect(listing.status).toBe("Active");

        return done();
      });
  });
  test("Unsuccessful fetching of a listing", (done) => {
    request(app)
      .get(`/api/v1/listings/000000000000000000000054`)
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send()
      .expect(404)
      .end(done);
  });
});
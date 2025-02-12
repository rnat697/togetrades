import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import routes from "../offers.js";
import {
  addAllMockData,
  bearerAgatha,
  bearerFurina,
  bearerNavia,
  bearerVenti,
  listingIvyForLunaLynney,
  offerBulbForNaviaLunaListing,
  offerBulbForVentiIvyListing,
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

// ---------------- Fetching Outgoing Offers ----------------
describe("Fetching outgoing offers GET /api/v1/offers/outgoing-offers", () => {
  test("Successful fetching of outgoing offers - no outgoing offers", (done) => {
    request(app)
      .get("/api/v1/offers/outgoing-offers")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let data = res.body;
        expect(data.success).toBe(true);
        expect(data.metadata.isEmpty).toBe(true);
        return done();
      });
  });
  test("Successful fetching of outgoing offers", (done) => {
    request(app)
      .get("/api/v1/offers/outgoing-offers")
      .set("Cookie", [`authorization=${bearerFurina}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let data = res.body;
        expect(data.success).toBe(true);
        expect(data.data.length).toBe(5);
        expect(data.metadata.isEmpty).toBe(false);

        // check if its in order (Pending, Accepted, Declined)
        const offers = data.data;
        expect(offers[0].status).toBe("Pending");
        expect(offers[1].status).toBe("Pending");
        expect(offers[2].status).toBe("Accepted");
        expect(offers[3].status).toBe("Declined");
        return done();
      });
  });

  test("Fetching offers outside of max page limit, 400 status", (done) => {
    request(app)
      .get("/api/v1/offers/outgoing-offers?page=2")
      .set("Cookie", [`authorization=${bearerFurina}`])
      .send()
      .expect(400)
      .end(done);
  });
});

// ---------------- Accepting an offer ----------------
describe("Accepting an offer POST /api/v1/offers/:offerId/accept", () => {
  test("Successful accepting of an offer", (done) => {
    request(app)
      .post(`/api/v1/offers/${offerBulbForNaviaLunaListing._id}/accept`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        let data = res.body;
        expect(data.success).toBe(true);
        expect(data.message).toBe(
          "Offer #0002 accepted successfully. You now own bulbasaur."
        );
        return done();
      });
  });
  test("Offer doesn't existm, status 404", (done) => {
    request(app)
      .post(`/api/v1/offers/000000000000000000003555/accept`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(404)
      .end(done);
  });
});

// ---------------- DECLINE an offer ----------------
describe("Decline an offer POST /api/v1/offers/:offerId/decline", () => {
  test("Successful Decline of an offer", (done) => {
    request(app)
      .post(`/api/v1/offers/${offerBulbForNaviaLunaListing._id}/decline`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        let data = res.body;
        expect(data.success).toBe(true);
        expect(data.message).toBe("Offer #0002 declined successfully.");
        return done();
      });
  });
  test("Offer doesn't exist, status 404", (done) => {
    request(app)
      .post(`/api/v1/offers/000000000000000000003555/decline`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(404)
      .end(done);
  });
});

// ---------------- Fetching Incoming Offers ----------------
describe("Fetching Incoming offers GET /api/v1/offers/incoming-offers", () => {
  test("Successful fetching of Incoming offers - no Incoming offers", (done) => {
    request(app)
      .get("/api/v1/offers/incoming-offers")
      .set("Cookie", [`authorization=${bearerFurina}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let data = res.body;
        expect(data.success).toBe(true);
        expect(data.metadata.isEmpty).toBe(true);
        return done();
      });
  });
  test("Successful fetching of incoming offers -sorted by recency", (done) => {
    request(app)
      .get("/api/v1/offers/incoming-offers")
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let data = res.body;
        expect(data.success).toBe(true);
        expect(data.data.length).toBe(2);
        expect(data.metadata.isEmpty).toBe(false);

        // check if first offer is more recent than 2nd offer
        let offers = data.data;
        expect(offers[0].dateCreated > offers[1].dateCreated).toBe(true);
        return done();
      });
  });

  test("Successful fetching of incoming offers - only pending", (done) => {
    request(app)
      .get("/api/v1/offers/incoming-offers")
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let data = res.body;
        expect(data.success).toBe(true);
        expect(data.data.length).toBe(1);
        expect(data.metadata.isEmpty).toBe(false);
        expect(data.data[0].status).toBe("Pending");

        return done();
      });
  });

  test("Fetching offers outside of max page limit, 400 status", (done) => {
    request(app)
      .get("/api/v1/offers/incoming-offers?page=2")
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(400)
      .end(done);
  });
});

// ---------------- Withdrawing Offers ----------------
describe("Withdrawing offers DELETE /api/v1/offers/:offerId/withdraw", () => {
  test("Successful withdraw of offer (deletes it)", (done) => {
    request(app)
      .delete(`/api/v1/offers/${offerBulbForVentiIvyListing._id}/withdraw`)
      .set("Cookie", [`authorization=${bearerFurina}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        let data = res.body;
        expect(data.success).toBe(true);
        expect(data.message).toBe("Offer #0003 withdrawn successfully.");
        return done();
      });
  });
  test("Offer doesn't exist, status 404", (done) => {
    request(app)
      .delete(`/api/v1/offers/000000000000000000003555/withdraw`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(404)
      .end(done);
  });
});
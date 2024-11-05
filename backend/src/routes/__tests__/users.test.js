import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import routes from "../users.js";
import jwt from "jsonwebtoken";
import {
  addAllMockData,
  bearerAgatha,
  bearerLynney,
  bearerNavia,
  bearerVenti,
  pokemonAgathasLunala,
  pokemonLynneysIvyasaur,
  pokemonNaviasIvysaur,
  pokemonNaviasLunala,
  pokemonVentisIvyasaur,
  pokemonVentisLunala,
  speciesIvysaur,
  speciesLunala,
  userAgatha,
  userLynney,
  userNavia,
  userVenti,
} from "../__mocks__/mock_data.js";

let mongod, db;
const app = express();
app.use(express.json());
app.use(cookieParser());
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
        expect(numPokemon).toBe(20);
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

// ------- Account Login Tests -------
describe("Account Login - POST /api/v1/users/login", () => {
  test("Succesful Login", (done) => {
    request(app)
      .post("/api/v1/users/login")
      .send({
        username: "Lynney",
        password: "password12345",
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        // Extract auth cookie
        const tokenCookie = res.headers["set-cookie"].find((cookie) =>
          cookie.startsWith("authorization=")
        );
        const token = tokenCookie.split("=")[1].split(";")[0];

        // Verify JWT token from cookie and contains correct username
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        expect(decodedToken._id).toBe(userLynney._id.toString());
        expect(decodedToken.username).toBe("Lynney");
        return done();
      });
  });
  test("Missing username - Login fails with HTTP 422", (done) => {
    request(app)
      .post("/api/v1/users/login")
      .send({ password: "password12345" })
      .expect(422, done);
  });

  test("Missing password - Login fails with HTTP 422", (done) => {
    request(app)
      .post("/api/v1/users/login")
      .send({ username: "Lynney" })
      .expect(422, done);
  });

  test("Wrong username - Login fails with HTTP 401", (done) => {
    request(app)
      .post("/api/v1/users/login")
      .send({ username: "NotExist", password: "password12345" })
      .expect(401, done);
  });

  test("Wrong password - Login fails with HTTP 401", (done) => {
    request(app)
      .post("/api/v1/users/login")
      .send({ username: "Lynney", password: "passcode" })
      .expect(401, done);
  });
});

// ------- FETCHING USER'S POKEMON -------
describe("GET /api/v1/users/:id/pokemon", () => {
  test("Successful fetching of all pokemon owned by user", (done) => {
    request(app)
      .get(`/api/v1/users/${userNavia._id}/pokemon`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Check meta data
        const response = res.body;
        expect(response.success).toBe(true);
        expect(response.metadata.totalCount).toBe(7);
        expect(response.metadata.page).toBe(1);
        expect(response.metadata.totalPages).toBe(1);
        expect(response.metadata.limit).toBe(20);

        const pokemon = response.data;
        expect(pokemon.length).toBe(7);
        expect(pokemon[0]._id).toBe(pokemonNaviasLunala._id.toString());
        expect(pokemon[1]._id).toBe(pokemonNaviasIvysaur._id.toString());

        // check if species data is populated
        expect(typeof pokemon[0].species).toBe("object");
        expect(pokemon[0].species._id).toBe(speciesLunala._id.toString());
        return done();
      });
  });
  test("Successful pagination - 1st page, total pages 3", (done) => {
    request(app)
      .get(`/api/v1/users/${userAgatha._id}/pokemon`)
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Check meta data
        const response = res.body;
        expect(response.success).toBe(true);
        expect(response.metadata.totalCount).toBe(50);
        expect(response.metadata.page).toBe(1);
        expect(response.metadata.totalPages).toBe(3);
        expect(response.metadata.limit).toBe(20);

        const pokemon = response.data;
        expect(pokemon.length).toBe(20);
        expect(pokemon[0]._id).toBe(pokemonAgathasLunala._id.toString());

        // check if species data is populated
        expect(typeof pokemon[0].species).toBe("object");
        expect(pokemon[0].species._id).toBe(speciesLunala._id.toString());
        return done();
      });
  });
  test("Successful pagination - 2nd page, total pages 3", (done) => {
    request(app)
      .get(`/api/v1/users/${userAgatha._id}/pokemon?page=2`)
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Check meta data
        const response = res.body;
        expect(response.success).toBe(true);
        expect(response.metadata.totalCount).toBe(50);
        expect(response.metadata.page).toBe(2);
        expect(response.metadata.totalPages).toBe(3);
        expect(response.metadata.limit).toBe(20);

        const pokemon = response.data;
        expect(pokemon.length).toBe(20);
        return done();
      });
  });

  test("Successful pagination - 3rd page, total pages 3", (done) => {
    request(app)
      .get(`/api/v1/users/${userAgatha._id}/pokemon?page=3`)
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Check meta data
        const response = res.body;
        expect(response.success).toBe(true);
        expect(response.metadata.totalCount).toBe(50);
        expect(response.metadata.page).toBe(3);
        expect(response.metadata.totalPages).toBe(3);
        expect(response.metadata.limit).toBe(20);

        const pokemon = response.data;
        expect(pokemon.length).toBe(10);
        return done();
      });
  });
  test("Unsuccessful pagination - 4th page attempt, total pages 3", (done) => {
    request(app)
      .get(`/api/v1/users/${userAgatha._id}/pokemon?page=4`)
      .set("Cookie", [`authorization=${bearerAgatha}`])
      .send()
      .expect(400)
      .end(done);
  });

  test("Successful fetching of another user's pokemon [trading only]", (done) => {
    request(app)
      .get(`/api/v1/users/${userNavia._id}/pokemon`)
      .set("Cookie", [`authorization=${bearerLynney}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const response = res.body;
        const pokemon = response.data;
        expect(pokemon.length).toBe(6);
        expect(pokemon[0]._id).toBe(pokemonNaviasIvysaur._id.toString());

        // check if species data is populated
        expect(typeof pokemon[0].species).toBe("object");
        expect(pokemon[0].species._id).toBe(speciesIvysaur._id.toString());
        return done();
      });
  });

  test("Successful fetching of user's own locked pokemon", (done) => {
    request(app)
      .get(`/api/v1/users/${userLynney._id}/pokemon?favoritesOnly=true`)
      .set("Cookie", [`authorization=${bearerLynney}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const response = res.body;
        const pokemon = response.data;
        expect(pokemon.length).toBe(1);
        expect(pokemon[0]._id).toBe(pokemonLynneysIvyasaur._id.toString());
        expect(pokemon[0].isLocked).toBe(true);

        // check if species data is populated
        expect(typeof pokemon[0].species).toBe("object");
        expect(pokemon[0].species._id).toBe(speciesIvysaur._id.toString());
        return done();
      });
  });

  test("Successful fetching of user's own trading pokemon", (done) => {
    request(app)
      .get(`/api/v1/users/${userVenti._id}/pokemon?tradingOnly=true`)
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const response = res.body;
        const pokemon = response.data;
        expect(pokemon.length).toBe(1);
        expect(pokemon[0]._id).toBe(pokemonVentisLunala._id.toString());
        expect(pokemon[0].isTrading).toBe(true);

        // check if species data is populated
        expect(typeof pokemon[0].species).toBe("object");
        expect(pokemon[0].species._id).toBe(speciesLunala._id.toString());
        return done();
      });
  });

  test("Successful fetching of user's own shiny pokemon", (done) => {
    request(app)
      .get(`/api/v1/users/${userVenti._id}/pokemon?shinyOnly=true`)
      .set("Cookie", [`authorization=${bearerVenti}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const response = res.body;
        const pokemon = response.data;
        expect(pokemon.length).toBe(1);
        expect(pokemon[0]._id).toBe(pokemonVentisIvyasaur._id.toString());
        expect(pokemon[0].isShiny).toBe(true);

        // check if species data is populated
        expect(typeof pokemon[0].species).toBe("object");
        expect(pokemon[0].species._id).toBe(speciesIvysaur._id.toString());
        return done();
      });
  });

  test("Fetching a non-existent user's pokemon", (done) => {
    request(app)
      .get(`/api/v1/users/000000000000000000000054/pokemon`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(404)
      .end(done);
  });

  test("Unauthenticated user fetching a a list of user's pokemon", (done) => {
    request(app)
      .get(`/api/v1/users/${userLynney}/pokemon`)
      .send()
      .expect(401)
      .end(done);
  });
});

// ------- FETCHING ALL USERS -------
describe("GET /api/v1/users/", () => {
  test("Successful fetching of all users in database", (done) => {
    request(app)
      .get("/api/v1/users/")
      .set("Cookie", [`authorization=${bearerLynney}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const users = res.body;
        expect(users.length).toBe(3);
        expect(users[0]._id).toBe(userLynney._id.toString());
        expect(users[1]._id).toBe(userNavia._id.toString());
        expect(users[2]._id).toBe(userVenti._id.toString());
        return done();
      });
  });
  test("Unauthetnicated user fetching of all users in database", (done) => {
    request(app).get("/api/v1/users/").send().expect(401).end(done);
  });
});

// ------- FETCHING SPECIFIC USER -------
describe("GET /api/v1/users/:id", () => {
  test("Successful fetching of a users in database", (done) => {
    request(app)
      .get(`/api/v1/users/${userNavia._id}`)
      .set("Cookie", [`authorization=${bearerLynney}`])
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const user = res.body;
        expect(user._id).toBe(userNavia._id.toString());
        expect(user.username).toBe(userNavia.username.toString());
        expect(user.email).toBe(userNavia.email.toString());
        expect(user).not.toHaveProperty('passHash');
        return done();
      });
  });

  test("Fetching a non-existent user", (done) => {
    request(app)
      .get(`/api/v1/users/000000000000000000000054`)
      .set("Cookie", [`authorization=${bearerNavia}`])
      .send()
      .expect(404)
      .end(done);
  });

  test("Unauthetnicated user fetching of a user in database", (done) => {
    request(app).get(`/api/v1/users/${userNavia._id}`).send().expect(401).end(done);
  });
});
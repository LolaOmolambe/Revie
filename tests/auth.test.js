const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");

describe("Authentication Endpoints", () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });
  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should try to create user with valid credentials and success", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Testing",
      email: "testing@yahoo.com",
      password: "1234567",
      passwordConfirm: "1234567",
    });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("data.token");
  });

  it("should try to create user with invalid credentials (password mismatch) and fail", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Testing",
      email: "newfake2@yahoo.com",
      password: "1234567",
      passwordConfirm: "12345678",
    });

    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
  });

  it("should try to create user with invalid credentials ( invalid email) and fail", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Testing",
      email: "newfake2",
      password: "1234567",
      passwordConfirm: "1234567",
    });

    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
  });

  it("should try to create user that already exists and fail", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Testing",
      email: "testing@yahoo.com",
      password: "1234567",
      passwordConfirm: "1234567",
    });
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
  });

  it("should try to login with valid credentials and success", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testing@yahoo.com", password: "1234567" });

    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual("success");
    expect(res.body).toHaveProperty("data.token");
  });

  it("should try to login with invalid credentials and fail", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testing@yahoo.com", password: "fake67889" });

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
  });
});

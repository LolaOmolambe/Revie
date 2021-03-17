const request = require("supertest");
const mongoose = require("mongoose");

const User = require("../models/User");
const Apartment = require("../models/Apartment");
const Review = require("../models/Review");
const app = require("../app");

let testUser = {
  name: "Tester",
  email: "lola@yahoo.com",
  password: "1234567",
  passwordConfirm: "1234567",
};

describe("Review model Endpoints", () => {
  let token;
  beforeAll(async () => {
    await User(testUser).save();
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "lola@yahoo.com", password: "1234567" });
    token = response.body.data.token;
  });

  afterAll(async () => {
    await Review.deleteMany({});
    await Apartment.deleteMany({});
    await mongoose.connection.close();
  });

  //   it("should try to create review without being logged in and fail", async () => {
  //     const res = await request(app).post("/api/review/").send({
  //       address: "Lekki",
  //       state: "Lagos",
  //       country: "Nigeria",
  //       enviromentReview: "Clean and tidy",
  //       landlordReview: "Tolerant",
  //       amenitiesReview: "Enough",
  //       latitude: 3.8,
  //       longitude: 4.5,
  //     });

  //     expect(res.status).toEqual(401);
  //     expect(res.body.status).toEqual("error");
  //   });

  it("should try to create review with invalid payload and fail", async () => {
    const res = await request(app)
      .post("/api/review/")
      .set({ Authorization: "Bearer " + token })
      .send();
    expect(res.status).toEqual(400);
    expect(res.body.status).toEqual("error");
  });

  //   it("authenticated user should try to create review with valid payload and pass", async () => {
  //     const res = await request(app)
  //       .post("/api/review/")
  //       .set({ Authorization: "Bearer " + token })
  //       .send({
  //         address: "Lekki",
  //         state: "Lagos",
  //         country: "Nigeria",
  //         enviromentReview: "Clean and tidy",
  //         landlordReview: "Tolerant",
  //         amenitiesReview: "Enough",
  //         latitude: 3.8,
  //         longitude: 4.5,
  //       });
  //     console.log(res.body);
  //     expect(res.status).toEqual(200);
  //     expect(res.body.status).toEqual("success");
  //   });

  it("should try to get all reviews", async () => {
    const res = await request(app).get("/api/review/");

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
  });
});

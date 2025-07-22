import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import dotenv from "dotenv";

// If using Jest, these functions are available globally. If not, import them as needed.
// import { beforeEach, afterEach, describe, it, expect } from '@jest/globals';

dotenv.config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.DB_HOST);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("POST /api/users/login", () => {
  it("should login a user", async () => {
    const res = await request(app).post("/api/users/login").send({
      password: "12345",
      email: "test@exemple.com",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBe({
      email: "test@exemple.com",
      subscription: "starter",
    });
  });
});

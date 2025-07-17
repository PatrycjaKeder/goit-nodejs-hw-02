import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const { DB_USER, DB_PASS, DB_NAME } = process.env;

console.log("DB_USER:", DB_USER);
console.log("DB_PASS:", DB_PASS);
console.log("DB_NAME:", DB_NAME);

const MONGODB_URI = `mongodb://${DB_USER}:${DB_PASS}@cluster0-shard-00-00.mongodb.net:27017,cluster0-shard-00-01.mongodb.net:27017,cluster0-shard-00-02.mongodb.net:27017/${DB_NAME}?retryWrites=true&w=majority`;

if (!MONGODB_URI) {
  console.error("Brak MONGODB_URI w zmiennych środowiskowych");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Connection error", error.message);
  });

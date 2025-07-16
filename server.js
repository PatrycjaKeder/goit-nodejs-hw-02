import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const { DB_USER, DB_PASS, DB_NAME } = process.env;

//

const MONGODB_URI = `mongodb://${DB_USER}:${DB_PASS}@cluster0-shard-00-00.mongodb.net:27017,cluster0-shard-00-01.mongodb.net:27017,cluster0-shard-00-02.mongodb.net:27017/${DB_NAME}?retryWrites=true&w=majority`;

if (!MONGODB_URI) {
  console.error("Brak MONGODB_URI w zmiennych środowiskowych");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Połączono z MongoDB");
  })
  .catch((error) => {
    console.error("Błąd podczas łączenia z MongoDB:", error.message);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});

export default app;

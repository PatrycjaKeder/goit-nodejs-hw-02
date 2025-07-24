import "dotenv/config";
import app from "./app.js";
import mongoose from "mongoose";

const { DB_USER, DB_PASS, DB_NAME } = process.env;

// Użyj poprawnego URI połączenia z użyciem zmiennych środowiskowych
const MONGODB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.z4qd6.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

if (!MONGODB_URI) {
  console.error("Brak MONGODB_URI w zmiennych środowiskowych");
  process.exit(1);
}

// Usuń te linie, jeśli zmienne nie są używane
// const tempDir = path.join(process.cwd(), 'public/temp');
// const storeImageDir = path.join(process.cwd(), 'public/avatars');

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database connection successful");
    app.listen(3000, async () => {
      console.log("Server running. Use our API on port: 3001");
      // Usuń te linie, jeśli funkcja 'setupFolder' nie jest potrzebna
      // await setupFolder(tempDir);
      // await setupFolder(storeImageDir);
    });
  } catch (error) {
    console.error("Database connection failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();

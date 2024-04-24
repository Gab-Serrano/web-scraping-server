const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const recipeRoutes = require("./routes/recipeRoutes"); // Importa tus rutas de recetas
app.use(recipeRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

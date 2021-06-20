const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { connectToDb } = require("./mongoConfig");

const authRoute = require("./api/auth");
const usersRoute = require("./api/users");

const requireAuth = require("./middleware/requireAuth");

const { handleError } = require("./errorHandler");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", requireAuth, usersRoute);

app.use(handleError);

const PORT = process.env.PORT || 4000;

connectToDb()
   .then(() => {
      console.log("Database connected");
      app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
   })
   .catch(error => {
      console.error(error);
      process.exit(1);
   });

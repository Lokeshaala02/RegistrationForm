const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT || 3000;
const cors = require("cors");
const User = require("./User/UserModel");
const URL = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.xrvufks.mongodb.net/retryWrites=true&w=majority`;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "user_registration",
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const user = User({
    name,
    email,
    password,
  });

  user
    .save()
    .then((data) => {
      res.json("Success");
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({
    email: email,
  })
    .then((data) => {
      if (data.password === password) {
        res.json(data);
      } else {
        res.json("Wrong password");
      }
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

const bcrypt      = require('bcrypt');
const saltRounds  = 10;

var cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"]
}));

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const mapRoutes   = require("./routes/maps")

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Home
app.get("/", (req, res) => {
  let userVerification = {user_id: req.session.id}
  res.render("splash", userVerification)
});

// Mount all map resource routes
app.use("/api/maps", mapRoutes(knex));

//map index
app.get("/maps", (req, res) => {
  let userVerification = {user_id: req.session.id}
  res.render("map_list", userVerification)
});

// Carlo Ferrer Edit:
// Changed from app.post to app.get b/c need to load map creation page - submission of map creation, i.e., .post, is handled by maps.js under router.post('/create') etc.
// load map creation page
// app.get("/maps/create", (req, res) => {
//   let userAndMap = {
//     user_id: req.session.id,
//     map_id: 'CREATE'
//   }
//   res.render("maps", userAndMap)
// });

//map display
app.get("/maps/:id", (req, res) => {
  // Carlo Ferrer Edit:
  // Changed/added to object passed to res.render to include both user_id and map_id
  let userAndMap = {
    user_id: req.session.id,
    map_id: req.params.id
  }
  res.render("maps", userAndMap)
});

//map edit
app.put("/maps/edit", (req, res) => {
  let userVerification = {user_id: req.session.id}
  res.render("maps", userVerification)
});

app.use("/api/users", usersRoutes(knex));

//user routes
app.get("/users/login", (req, res) => {
  let userVerification = {user_id: req.session.id}
  res.render("login", userVerification)
});

//register new user
app.post("/register", (req, res) => {

  if (!req.body.reg_username || !req.body.reg_password) {
    res.status(400).send("Either the email or password field was empty. Please try again.")
    return;
  };

  let hashed = req.body.reg_password;
  let hashedPassword = bcrypt.hashSync(hashed, 10);

  knex
  .select("*")
  .from("users")
  .where("username", req.body.reg_username)
  .then((userRow) => {
      if (userRow[0] && userRow[0].username === req.body.reg_username) {
        return res.status(400).send("Username already exists")
      } else {
      knex("users")
      .insert({
        username: req.body.reg_username,
        password: hashedPassword
      })
      .returning("id")
      .then((id) => {
        req.session.id = id
        res.redirect("/")
      })
      .catch((err) => {
        console.error(err)
      })
    }
  });
})

//login page
app.post("/login", (req, res) => {
  let userPass = req.body.password
  return knex
  .select("*")
  .from("users")
  .where("username", req.body.username)
  .then((userRow) => {
    if (bcrypt.compareSync(userPass, userRow[0].password)) {
      req.session.id = userRow[0].id
      let userVerification = {user_id: req.session.id}
      res.redirect("/")
    }
  })
  .catch((err) => {
    res.status(500).send("Error, please try again" + err)

  })
})

//logout, clear cookies
app.post("/logout", (req, res) => {
  res.clearCookie("id")
  delete req.session.id
  res.redirect("/")
})

//user profile page
app.get("/users/:id", (req, res) => {
  let userVerification = {user_id: req.session.id}
  if (req.session.id) {
    return res.render("profile", userVerification)
  }
})

app.post("/users/edit/:id", (req, res) => {
  knex("users").where("id", "=", req.params.id)
  .update("username", req.body.username)
  .update("about_me", req.body.about)
  .then(() => {
    return res.redirect("/")
  })
  .catch((err) => {
    console.error(err)
  })
})

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
})

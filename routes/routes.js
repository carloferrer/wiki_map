"use strict";

const express = require('express');
const router  = express.Router();

//Splash and maps

// Home
app.get("/", (req, res) => {
  res.render("splash")
});

//map index
app.get("/map", (req, res) => {
  res.render("map_list")
});

//map display
app.get("/map/:id", (req, res) => {
  res.render("/map")
});

//map edit
app.put("/map", (req, res => {
  res.render("/map")
});


//user routes
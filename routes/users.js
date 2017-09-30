"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/:id", (req, res) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>test")
    knex
    .select("*")
    .from("users")
    .where("id", req.params.id)
    .then((results) => {
      console.log(results)
      console.log("test")
      res.json(results)
    })
  })

  return router;
}


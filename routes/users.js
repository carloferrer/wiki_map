"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get("/:id", (req, res) => {
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

  //edit user profile
  router.post("/edit/users/:id", (req, res) => {
    knex("users").where("id", "=", req.params.id)
      .update("username", "red")
      .update("about_me", "about me section entry")
      .then(() => {
        res.statusCode(200).send()
      })
      .catch((err) => {
        console.error(err)
      })
  })


  return router;
}


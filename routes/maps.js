"use strict";

const express = require('express')
const router  = express.Router()

module.exports = (knex) => {

  router.get("/:id", (req, res) => {
    knex
    .select("*")
    .from("maps_index")
    .where({
      id: [req.params.id]
    })
    .then((results) => {
      res.json(results)
    })
  })

  router.get("/:id/points", (req, res) => {
    knex
    .select("*")
    .from("maps_points")
    .where({
      map_index_id: [req.params.id]
    })
    .then((results) => {
      res.json(results)
    })
  })

  router.put("/:id/points/:points_id", (req, res) => {
    knex("map_points").where("id", "=", req.body.point_id)
    .update("point_title", req.body.title)
    .update("point_url", req.body.url)
    .update("coordinate_x", req.body.x)
    .update("coordinate_y", req.body.y)
    .update("point_pic", req.body.pic)
    .then(() => {
      res.statusCode(200).send();
    })
  })

  return router;
}
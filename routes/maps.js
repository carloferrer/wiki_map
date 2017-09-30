"use strict";

const express = require('express')
const router  = express.Router()

module.exports = (knex) => {

  //Load map index
  router.get("", (req, res) => {
    // Carlo Ferre debugging:
    console.log('\n***INSIDE LOAD MAP INDEX ROUTE***\n')

    knex
    .select("*")
    .from("map_index")
    .then((results) => {
      res.json(results)
    })
    .catch((err) => {
      console.error(err)
    })
  })

  //Load map
  router.get("/:id", (req, res) => {
    knex
    .select("*")
    .from("map_index")
    .where({
      id: req.params.id
    })
    .then((results) => {
      res.json(results[0])
    })
    .catch((err) => {
      console.error(err)
    })
  })

    //Load users created and contributed maps
    router.get("/users/:id", (req, res) => {
      knex
      .select("*")
      .from("map_index")
      .where({
        creator_id: req.params.id
      })
      .then((results) => {
        res.json(results)
      })
      .catch((err) => {
        console.error(err)
      })
    })

  //Load map points
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
    .catch((err) => {
      console.error(err)
    })
  })

  // //favorite a map
  // router.post("/fav", (req, res) => {
  //   knex("favourite")

  // })

  //create new map
  router.post("/create", (req, res) => {
    knex("map_index")
    .insert({
      title: req.body.map_title,
      creator_id: req.session.id
    })
  })

  //add point to map
  router.post(":id/points/new", (req, res) => {
    knex("map_points").where("map_index_id", "=", req.params.id)
    .insert({
      point_title: req.body.point_title,
      point_url: req.body.url,
      coordinate_x: req.body.x,
      coordinate_y: req.body.y,
      point_pic: req.body.pic
    })
    .then(() => {
      res.statusCode(200).send()
    })
    .catch((err) => {
      console.error(err)
    })
  })

  //edit map title
  router.put("/:id", (req, res) => {
    knex("map_index").where("id", "=", req.params.id)
    .update("title", req.body.map_title)
    .then(() => {
      res.statusCode(200).send()
    })
    .catch((err) => {
      console.error(err)
    })
  })

  //delete map
  router.delete("/:id", (req, res) => (
    knex("map_index").where("id", "=", req.params.id)
    .del()
    .then(() => {
      res.redirect("/maps")
    })
  ))

  //edit points
  router.put("/:id/points/:points_id", (req, res) => {
    knex("map_points").where("id", "=", req.body.point_id)
    .update("point_title", req.body.point_title)
    .update("point_url", req.body.url)
    .update("coordinate_x", req.body.x)
    .update("coordinate_y", req.body.y)
    .update("point_pic", req.body.pic)
    .then(() => {
      res.statusCode(200).send();
    })
    .catch((err) => {
      console.error(err)
    })
  })

  //delete points
  router.delete("/:id/points/:points_id", (req, res) => {
    knex("map_points").where("id", "=", req.body.point_id)
    .del()
    .then(() => {
      res.statusCode(200).send()
    })
    .catch((err) => {
      console.error(err)
    })
  })

  return router;
}

"use strict";

const express = require('express')
const router  = express.Router()

module.exports = (knex) => {

  //Load map index
  router.get("", (req, res) => {
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
    router.get("/profile/users/:id", (req, res) => {
      console.log("FINDING POINTS REFERENCE")
      knex('map_points')
      .join("map_index", "map_points.map_index_id", "=", "map_index.id")
      .select("map_points.creator_id", "map_index.id", "map_index.title")
      .where("map_points.creator_id", req.params.id)
      .distinct()
      .then((results) => {
        res.json(results)
      })
      .catch((err) => {
        console.error(err)
      })
    })

  //Load map points
  router.get("/:id/points", (req, res) => {
    // Carlo debugging....
    console.log('**INSIDE ROUTER GET POINTS**');
    console.log('the following is the map_index_id',req.params.id);
    knex
    .select("*")
    .from("map_points")
    .where({
      map_index_id: req.params.id
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


    if (!req.body.map_title) {
      res.status(400);
      console.log('error: invalid request: no data in POST body');
      return;
    }

    console.log(req.body.map_title, req.session.id[0]);

    knex("map_index")
    .insert(
    { title: req.body.map_title, creator_id: req.session.id[0] }
    , 'id')
    .catch((err) => {
      console.error(err)
    })

  })

  //add point to map
  router.post("/:id/points/new", (req, res) => {
    // Carlo debuggin...
    console.log("THIS BE THE REQBODYPOINTTITLE:",req.body.point_title);
    console.log("THIS BE THE REQBODYDESC:",req.body.point_desc);
    console.log("THIS BE THE LATITUDE:",req.body.x);
    console.log("THIS BE THE LONGITUDE:",req.body.y);
    knex("map_points").where("map_index_id", "=", req.params.id)
    .insert({
      point_title: req.body.point_title,
      // Carlo Debugging: currently cannot satisfy the following stretch goal
      // point_url: req.body.url,
      coordinate_x: req.body.x,
      coordinate_y: req.body.y,
      point_description: req.body.point_desc,
      map_index_id: req.params.id,
      creator_id: req.session.id[0]
      // Carlo Debugging: commented out the following since don't have pic to test w/
      // point_pic: req.body.pic
    }, 'id')
    .then(() => {
      res.status(200).send()
    })
    .catch((err) => {
      console.log('HERE BE AN ERROR')
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

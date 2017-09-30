const faker = require('faker');

exports.seed = function(knex, Promise) {
  const seedCoordinates = function () {
    return knex('map_points').insert([
      {
        point_title: 'point1',
        point_url: faker.internet.url(),
        coordinate_x: 43.652,
        coordinate_y: -79.40,
        point_pic: null,
        creator_id: 2,
        map_index_id: ids[0]
      },
      {
        point_title: 'point2',
        point_url: faker.internet.url(),
        coordinate_x: 43.644,
        coordinate_y: -79.38,
        point_pic: null,
        creator_id: 3,
        map_index_id: ids[0]
      }
    ]);
  };

  // Deletes ALL existing entries
  return knex('map_points').del()
  .then(function () {
    return knex.table('map_index').pluck('id')
    .then(function (ids){
        return seedCoordinates(ids);
      });
  })
  .catch(function (err) {
      console.log(err);
  });
};

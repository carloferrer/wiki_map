const faker = require('faker');

const randoUsername1 = faker.name.firstName();
const randoUsername2 = faker.name.firstName();
const randoUsername3= faker.name.firstName();
const randoTitle11 = faker.lorem.words();
const randoTitle12 = faker.lorem.words();
const randoTitle21 = faker.lorem.words();
const randoTitle22 = faker.lorem.words();
const randoTitle31 = faker.lorem.words();
const randoTitle32 = faker.lorem.words();

exports.seed = function(knex, Promise) {
  const seedUsers = function () {
    return knex('users').insert([
      {username: randoUsername1, password: admin,
      {username: randoUsername2, password: faker.internet.password()},
      {username: randoUsername3, password: faker.internet.password()},
    ], 'id');
  };

  const seedMaps = function (userid) {
    return knex('map_index').insert([
      {title: randoTitle11, creator_id: userid[0]},
      {title: randoTitle12, creator_id: userid[0]},
      {title: randoTitle21, creator_id: userid[1]},
      {title: randoTitle22, creator_id: userid[1]},
      {title: randoTitle31, creator_id: userid[2]},
      {title: randoTitle32, creator_id: userid[2]}
    ], 'id');
  };

  const seedFave = function (mapid, userid) {
    return knex('favourite').insert([
      {map_id: mapid[0], user_id: userid[0]},
      {map_id: mapid[0], user_id: userid[1]},
      {map_id: mapid[1], user_id: userid[2]},
      {map_id: mapid[1], user_id: userid[0]},
      {map_id: mapid[2], user_id: userid[2]},
      {map_id: mapid[3], user_id: userid[1]},
      {map_id: mapid[4], user_id: userid[0]},
      {map_id: mapid[5], user_id: userid[1]},
      {map_id: mapid[5], user_id: userid[2]}
    ]);
  };

  return knex('favourite').del()
  .then(function() { return knex('map_index').del(); })
  .then(function() { return knex('users').del(); })
  .then(function () {
    return seedUsers()
        .then(function(userid) {
          return seedMaps(userid).then(function(mapid) {
            return seedFave(mapid, userid);
          });
        })
        .catch(function (err) {
          console.log(err);
        });
  });
};

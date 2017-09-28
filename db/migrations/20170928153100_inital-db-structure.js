/* jshint asi: false */

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.renameColumn('name', 'username');
      table.string('password');
    }),
    knex.schema.createTable('map_index', function(table) {
      table.increments('id');
      table.string('title');
      table.integer('creator_id');
      table.foreign('creator_id').references('users.id');
    }),
    knex.schema.createTable('favourite', function(table) {
      table.integer('map_id');
      table.foreign('map_id').references('map_index.id');
      table.integer('user_id');
      table.foreign('user_id').references('users.id');
      table.primary(['map_id', 'user_id']);
    }),
    knex.schema.createTable('map_points', function(table) {
      table.increments('id');
      table.string('point_title');
      table.string('point_url');
      table.float('coordinate_x', 5);
      table.float('coordinate_y', 5);
      table.string('point_pic');
      table.integer('creator_id').references('users.id');
      table.integer('map_index_id').references('map_index.id');
    })
  ]);
};

exports.down = function(knex, Promise) {

};


exports.up = function(knex, Promise) {
  return knex.schema.table('map_points', function(table) {
    table.string('point_description', 140);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('map_points', function(table) {
    table.dropColumn('map_points');
  });
};

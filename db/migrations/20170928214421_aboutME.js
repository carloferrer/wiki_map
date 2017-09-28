
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
      table.string('about_me', 500);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('about_me');
  });
};

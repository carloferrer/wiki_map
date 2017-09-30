$(document).ready(function() {

  loadMapIndex();
  createNewMap();

  function loadMapIndex() {
    $.get('http://localhost:8080/api/maps')
    .done(function(maps) {
      console.log("MAPS LENGTH:" + maps.length);
      for (let i = 0; i < maps.length; i++) {
        $('#map-list').append('<li> <a href=/maps/'+maps[i].id+'>'+maps[i].title+'</a><br>');
      }

    })
    .fail(function(error) {
      console.error(error);
    });
  }

  function createNewMap() {
    var newMapNum = 'NEW MAP; INDEX#:';

    $('#create-new-map').on('click', function() {

      $.get('http://localhost:8080/api/maps')
      .done(function(maps) {
        newMapNum += maps.length;
        console.log(newMapNum);

      })
      .fail(function(error) {
        console.error(error);
      });

      $.post('http://localhost:8080/api/maps/create')
      .done(function() {

      })
      .fail(function(error) {
        console.error(error);
      });

    });
  }


});

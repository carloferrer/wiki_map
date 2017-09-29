$(document).ready(function() {

  loadMapIndex();

  function loadMapIndex(){
    $.get('http://localhost:8080/api/maps')
    .done(function(maps) {
      for (let i = 0; i < maps.length; i++) {
        $('#map-list').append('<li> <a href=/maps/'+maps[i].id+'>'+maps[i].title+'</a><br>');
      }

    })
    .fail(function(error) {
      console.error(error);
    });
  }

});

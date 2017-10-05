$(document).ready(function() {

  loadMapIndex();
  formSubmission()
  // createNewMap();

  function loadMapIndex() {
    $.get('http://localhost:8080/api/maps')
    .done(function(maps) {
      console.log("MAPS LENGTH:" + maps.length);
      $('#map-list').empty();
      for (var i = 0; i < maps.length; i++) {
        $('#map-list').append('<li> <a class="list-group-item list-group-item-action" href=/maps/'+maps[i].id+'>'+maps[i].title+'</a><br>');
      }

    })
    .fail(function(error) {
      console.error(error);
    });
  }


  function createNewMap(newTitle) {
      $.post('http://localhost:8080/api/maps/create', newTitle)
      .done(function(){})
      .fail(function(error) {
        console.error(error);
      });

      loadMapIndex();
  }

  function formSubmission() {

    $('#new-map').on('submit', function(event) {

      event.preventDefault();
      var newTitle = $('textarea').serialize();
      console.log(newTitle);

      createNewMap(newTitle);

    });

  }


});

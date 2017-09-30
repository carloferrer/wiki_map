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
        $('#map-list').append('<li> <a href=/maps/'+maps[i].id+'>'+maps[i].title+'</a><br>');
      }

    })
    .fail(function(error) {
      console.error(error);
    });
  }

  function createNewMap(newTitle) {
      $.post('http://localhost:8080/api/maps/create', newTitle)
      .done(function(results) {
        console.log(results);
        loadMapIndex();
      })
      .fail(function(error) {
        console.error(error);
      });

  }

  function formSubmission() {

    $('#new-map').on('submit', function(event) {

      event.preventDefault();
      var newTitle = $('textarea').serialize();
      console.log(newTitle);

      createNewMap(newTitle);

    });



  //   //   $.get('http://localhost:8080/api/maps')
  //   //   .done(function(maps) {
  //   //     newMapNum += maps.length;
  //   //     console.log(newMapNum);

  //   //   })
  //   //   .fail(function(error) {
  //   //     console.error(error);
  //   //   });

  //   //   $.post('http://localhost:8080/api/maps/create')
  //   //   .done(function() {

  //   //   })
  //   //   .fail(function(error) {
  //   //     console.error(error);
  //   //   });

  //   // });
  //   }
  }


});

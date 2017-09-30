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

    // console.log("createNewMap loaded.");
  //   // var newMapNum = 'NEW MAP; INDEX#:';

    $('#new-map').on('submit', function(event) {
      event.preventDefault();
      console.log('CLICKING SUBMIT.');
      var newTitle = $('textarea').serialize();
      console.log(newTitle);
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

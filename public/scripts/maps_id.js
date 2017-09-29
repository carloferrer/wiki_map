$(document).ready(function() {

  let path = window.location.pathname;

  loadMap();

  function loadMap(){
    $.get('http://localhost:8080/api'+path)

    .done(function(map) {
      // for (let i = 0; i < maps.length; i++) {
      //   $('#map-list').append('<li>'+maps[i].title+'<br>');
      // }
      console.log(map.title);
      console.log(map);
    })
    .fail(function(error) {
      console.error(error);
    });
  }

});

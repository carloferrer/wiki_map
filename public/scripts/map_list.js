$(document).ready(function() {

  loadMapIndex();

  function loadMapIndex(){
    $.get('http://localhost:8080/api/maps')
    .done(function(result) {
      console.log(result);
    })
    .fail(function(error) {
      console.error(error);
    });
  }

});

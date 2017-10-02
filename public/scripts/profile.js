$(document).ready(function() {
  console.log("test")
  $('#about-me').empty();

  function loadUserData () {
    $.get('http://localhost:8080/api'+window.location.pathname)
    .done(function(userRow) {
      console.log(userRow[0])
      $('#about-me').append('<h2 class="username">'+userRow[0].username+'</h2>')
      $('#about-me').append('<p class="about">'+userRow[0].about_me+'</p>')
    })

    .fail(function(error) {
      console.error(error);
    })
  }
  
  function loadMapIndex() {
    $.get('http://localhost:8080/api/maps/profile'+window.location.pathname)
    .done(function(maps) {
      console.log("test for map list load")
      console.log(maps)
      for (let i = 0; i < maps.length; i++) {
          $('#map-list').append('<li> <a href=/maps/'+maps[i].id+'>'+maps[i].title+'</a><br>');
        }
    })
    .fail(function(error) {
      console.error(error);
    })
  }


  loadUserData()

  loadMapIndex()

})
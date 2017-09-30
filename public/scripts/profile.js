$(document).ready(function() {
  console.log("test")

  function loadUserData () {
    $.get('http://localhost:8080/api'+window.location.pathname)
    .done(function(userRow) {
      console.log(userRow)
      $('#about-me').append('<h2 class="username">'+userRow[0].username+'</h2>')
      $('#about-me').append('<p class="about">'+userRow[0].about_me+'</p>')
    })

    .fail(function(error) {
      console.error(error);
    })
  }

  loadUserData()

})
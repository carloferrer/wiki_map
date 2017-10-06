$(() => {

  $("#logoutEvent").click(function(event) {
    event.preventDefault();
     $.ajax({
      url: '/logout',
      method: 'POST',

      success: function(result) {
          alert("Log out completed")
          window.location.href = "/"
      }
    })
  })

})
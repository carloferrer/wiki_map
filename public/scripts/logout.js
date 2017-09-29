$(() => {

  $("#logoutEvent").click(function(event) {
    event.preventDefault();
     $.ajax({
      url: '/logout',
      method: 'POST',

      success: function(result) {
          window.location.href = "/"
      }
    })
  })

})
$(function () {
  $("#chk-box").click(function () {
      if ($(this).is(":checked")) {
          $("#edit-form").show();
      } else {
          $("#edit-form").hide();
      }
  });

})
$(function () {
  $("#chkPassport").click(function () {
      if ($(this).is(":checked")) {
          $("#dvPassport").show();
      } else {
          $("#dvPassport").hide();
      }
  });
});
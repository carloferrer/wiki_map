$(document).ready(function() {
  $('a').on('click',function(){
    $('a').removeClass('selected');
    $(this).addClass('selected');
  });
})

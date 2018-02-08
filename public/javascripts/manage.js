$(function() {
  $(window).on("beforeunload", function() {
    $.post(window.location, {
      memo: $("#memo").val()
    });
  })
});

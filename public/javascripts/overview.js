$(function() {
  $.get("/consult/manage/" + $("#studentId").text() + "/memo", {})
  .done(function(d) {
    $("#memo").val(d);
  });

  $(window).on("beforeunload", function() {
    $.post(window.location, {
      memo: $("#memo").val()
    });
  })

  $("#doneButton").click(function() {
    window.location =  "/consult/manage/" + $("#studentId").text();
  });
})

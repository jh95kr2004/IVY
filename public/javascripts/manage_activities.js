$(function() {
  $("#doneButton").click(function() {
    window.location =  "/consult/manage/" + $("#studentId").text();
  });
});

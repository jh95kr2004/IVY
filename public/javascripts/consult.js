$(function() {
  $("#consultButton").click(function() {
    if($("table#studentsList tr.selected").length == 0) {
      alert("Please select student.");
      return;
    }
    window.location = "/consult/manage/" + $("table#studentsList tr.selected td.code").text();
  });
});

$(function() {
  $("#doneButton").click(function() {
    window.location = "/consult/manage/" + $("#studentId").text();
  });

  $("#editButton").click(function() {
    window.location = "/consult/manage/" + $("#studentId").text() + "/activities/edit/" + $("tr.selected td.code").text();
  });

  $(".resultContainer tbody tr").dblclick(function() {
    window.location = "/consult/manage/" + $("#studentId").text() + "/activities/edit/" + $(this).find("td.code").text();
  });

  $("#removeActivityButton").click(function() {
    $.get("/consult/manage/" + $("#studentId").text() + "/activities/remove/" + $("tr.selected td.code").text(), {})
    .done(function(data) {
      if(data == "1") {
        alert("Activity is removed successfully!");
        location.reload();
      } else
        alert("There is something wrong...");
    });
  });

  $(".resultContainer tbody tr").click(function() {
    if($("tr.selected").length > 0) {
      $("#editButton").removeAttr("disabled");
      $("#removeButton").removeAttr("disabled");
    } else {
      $("#editButton").attr("disabled", "true");
      $("#removeButton").attr("disabled", "true");
    }
  });
});

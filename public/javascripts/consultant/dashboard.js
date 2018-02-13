$(function() {
  $("#consultButton").click(function() {
    if($("table#studentsList tr.selected").length == 0) {
      alert("Please select student.");
      return;
    }
    window.location = "/consult/manage/" + $("table#studentsList tr.selected td.code").text();
  });

  $("#editButton").click(function() {
    if($("table#studentsList tr.selected").length == 0) {
      alert("Please select student.");
      return;
    }
    window.location = "/consult/edit/" + $("table#studentsList tr.selected td.code").text();
  });

  $("#removeStudentButton").click(function() {
    if($("table#studentsList tr.selected").length == 0) {
      alert("Please select student.");
      return;
    }
    $.post("/consult/remove/" + $("table#studentsList tr.selected td.code").text(), {
      studentId: $("table#studentsList tr.selected td.code").text(),
    }).done(function(data) {
      location.reload();
    });
  })

  $(".resultContainer tbody tr").dblclick(function() {
    window.location = "/consult/manage/" + $(this).find("td.code").text();
  });

  $(".resultContainer tbody tr").click(function() {
    if($("tr.selected").length > 0) {
      $("#editButton").removeAttr("disabled");
      $("#removeButton").removeAttr("disabled");
      $("#consultButton").removeAttr("disabled");
    } else {
      $("#editButton").attr("disabled", "true");
      $("#removeButton").attr("disabled", "true");
      $("#consultButton").attr("disabled", "true");
    }
  });
});

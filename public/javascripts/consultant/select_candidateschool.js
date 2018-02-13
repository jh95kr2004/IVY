$(function() {
  $("#cancelButton").click(function() {
    window.history.back();
  });

  $(".form-control").change(function() {
    if($("#schoolName").prop("selectedIndex") <= 0
    || $("#major").prop("selectedIndex") <= 0)
      $("#saveButton").attr("disabled", "true");
    else
      $("#saveButton").removeAttr("disabled");
  });

  $("#saveButton").click(function() {
    if($("#schoolName").prop("selectedIndex") <= 0
    || $("#major").prop("selectedIndex") <= 0) {
      $(this).attr("disabled", "true");
      return;
    }

    $.post(window.location, {
      schoolId: $("#schoolName").val(),
      majorId: $("#major").val()
    }).done(function(res) {
      if(res == 1) {
        alert("Updated successfully!");
        window.location = "/consult/manage/" + $("span#studentId").text() + "/candidate";
      } else alert("You entered wrong data. Please check and re-try.");
    });
  });
});

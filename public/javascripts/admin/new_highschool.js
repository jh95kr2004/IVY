$(function() {
  $(".form-control").keyup(function() {
    if($("#schoolName").val() == "" || $("#schoolLocation").val() == "") {
      $("#saveButton").attr("disabled", "true");
    } else {
      $("#saveButton").removeAttr("disabled");
    }
  });

  $("#cancelButton").click(function() {
    window.history.back();
  });

  $("#saveButton").click(function() {
    if($("#schoolName").val() == "" || $("#schoolLocation").val() == "") {
      $(this).attr("disabled", "true");
      return;
    }
    $.post("/admin/highschool/new", {
      name: $("#schoolName").val(),
      location: $("#schoolLocation").val()
    }).done(function(data) {
      if(data == 1) {
        alert("Added new high school successfully!");
        window.location = "/admin/highschool";
      } else alert("You entered wrong data. Please check and re-try");
    });
  });
});

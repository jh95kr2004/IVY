$(function() {
  $(".form-control").keyup(function() {
    if($("#fullname").val() == "" || $("#email").val() == "" || !($("#email").is(":valid"))) {
      $("#saveButton").attr("disabled", "true");
    } else {
      $("#saveButton").removeAttr("disabled");
    }
  });

  $("#cancelButton").click(function() {
    window.history.back();
  });

  $("#saveButton").click(function() {
    if($("#fullname").val() == "" || $("#email").val() == "" || !($("#email").is(":valid"))) {
      $(this).attr("disabled", "true");
      return;
    }
    $.post("/admin/new", {
      name: $("#fullname").val(),
      email: $("#email").val()
    }).done(function(data) {
      if(data.status == 1) {
        alert("Added new consultant successfully!");
        window.location = "/admin";
      } else if(data.status == -1) {
        alert("This email is already used.");
      } else if(data.status == 0) alert("You entered wrong data. Please check and re-try.");
    });
  });
});

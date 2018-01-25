$(function(){
  $(".form-control").keyup(function() {
    if($("#currentPassword").val() == "" || $("#newPassword").val() == "" || $("#newPasswordConfirm").val() == "") {
      $("#saveButton").attr("disabled", "true");
    } else {
      $("#saveButton").removeAttr("disabled");
    }
  });

  $("#saveButton").click(function() {
    if($("#currentPassword").val() == "" || $("#newPassword").val() == "" || $("#newPasswordConfirm").val() == "") {
      $(this).attr("disabled", "true");
      return;
    }
    if($("#newPassword").val() != $("#newPasswordConfirm").val()) {
      $("#editDescription").html("<font color='red'>Confirm password is different from new password.</font>");
      $(this).attr("disabled", "true");
      return;
    }

    $.post("/account/save", {
      currentPassword: $("#currentPassword").val(),
      newPassword: $("#newPassword").val(),
      newPasswordConfirm: $("#newPasswordConfirm").val()
    }).done(function(data) {
      if(data == "0") {
        alert("Account information is updated successfully!");
        window.history.back();
      } else $("#editDescription").html("<font color='red'>" + data + "</font>");
    });
  });
});

$(function() {
  $("#cancelButton").click(function() {
    window.history.back();
  });

  $(".form-control").keyup(function() {
    if($(this).val() == "" || $(this).is(":valid")) $("#saveButton").removeAttr("disabled");
    else $("#saveButton").attr("disabled", "true");
  });

  $(".form-control").change(function() {
    if($(this).val() == "" || $(this).is(":valid")) $("#saveButton").removeAttr("disabled");
    else $("#saveButton").attr("disabled", "true");
  });

  $("#saveButton").click(function() {
    if($("input#leadership").val() != "" && !($("input#leadership").is(":valid"))
    || $("input#communication").val() != "" && !($("input#communication").is(":valid"))
    || $("input#creativity").val() != "" && !($("input#creativity").is(":valid"))
    || $("input#intelligence").val() != "" && !($("input#intelligence").is(":valid"))
    || $("input#motivation").val() != "" && !($("input#motivation").is(":valid"))
    || $("input#character").val() != "" && !($("input#character").is(":valid"))) {
      $(this).attr("disabled", "true");
      return;
    }

    var data = new Object();
    if($("input#leadership").val() != "") data.leadership = parseInt($("input#leadership").val());
    if($("input#communication").val() != "") data.communication = parseInt($("input#communication").val());
    if($("input#creativity").val() != "") data.creativity = parseInt($("input#creativity").val());
    if($("input#intelligence").val() != "") data.intelligence = parseInt($("input#intelligence").val());
    if($("input#motivation").val() != "") data.motivation = parseInt($("input#motivation").val());
    if($("input#character").val() != "") data.character = parseInt($("input#character").val());

    $.post(window.location, data).done(function(res) {
      if(res == 1) {
        alert("Updated successfully!");
        window.location =  "/consult/manage/" + $("#studentId").text();
      } else alert("You entered wrong data. Please check and re-try.");
    });
  });
});

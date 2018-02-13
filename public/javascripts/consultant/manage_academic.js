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
    if(($("input#SATVerbal").val() != "" && !($("input#SATVerbal").is(":valid")))
    || ($("input#SATWriting").val() != "" && !($("input#SATWriting").is(":valid")))
    || ($("input#SATMath").val() != "" && !($("input#SATMath").is(":valid")))
    || ($("input#GPA").val() != "" && !($("input#GPA").is(":valid")))) {
      $(this).attr("disabled", "true");
      return;
    }

    var data = new Object();
    if($("input#SATVerbal").val() != "") data.SATVerbal = parseInt($("input#SATVerbal").val());
    if($("input#SATWriting").val() != "") data.SATWriting = parseInt($("input#SATWriting").val());
    if($("input#SATMath").val() != "") data.SATMath = parseInt($("input#SATMath").val());
    if($("input#GPA").val() != "") data.GPA = parseFloat($("input#GPA").val());

    $.post(window.location, data).done(function(res) {
      if(res == 1) {
        alert("Updated successfully!");
        window.location =  "/consult/manage/" + $("#studentId").text();
      } else alert("You entered wrong data. Please check and re-try.");
    });
  });
});

$(function() {
  $("#nextButton").click(function() {
    if($("input#SATVerbal").val() != "" && !($("input#SATVerbal").is(":valid"))
    || $("input#SATWriting").val() != "" && !($("input#SATWriting").is(":valid"))
    || $("input#SATMath").val() != "" && !($("input#SATMath").is(":valid"))
    || $("input#GPA").val() != "" && !($("input#GPA").is(":valid"))) {
      $(this).attr("disabled", "true");
      return;
    }
    $("#curricularInfoDiv").addClass("d-none");
    $("#extraCurricularInfoDiv").removeClass("d-none");
    $("#titleDiv span#title").text("Extra Curricular Info");
  });

  $("#backButton").click(function() {
    $("#extraCurricularInfoDiv").addClass("d-none");
    $("#curricularInfoDiv").removeClass("d-none");
    $("#titleDiv span#title").text("Curricular Info");
  });

  $("#cancelButton").click(function() {
    window.history.back();
  });

  $(".form-control").keyup(function() {
    if($(this).val() == "" || $(this).is(":valid")) $("#nextButton").removeAttr("disabled");
    else $("#nextButton").attr("disabled", "true");
  });

  $("#saveButton").click(function() {
    if($("input#SATVerbal").val() != "" && !($("input#SATVerbal").is(":valid"))
    || $("input#SATWriting").val() != "" && !($("input#SATWriting").is(":valid"))
    || $("input#SATMath").val() != "" && !($("input#SATMath").is(":valid"))
    || $("input#GPA").val() != "" && !($("input#GPA").is(":valid"))
    || $("input#leadership").val() != "" && !($("input#leadership").is(":valid"))
    || $("input#communication").val() != "" && !($("input#communication").is(":valid"))
    || $("input#creativity").val() != "" && !($("input#creativity").is(":valid"))
    || $("input#intelligence").val() != "" && !($("input#intelligence").is(":valid"))
    || $("input#motivation").val() != "" && !($("input#motivation").is(":valid"))
    || $("input#character").val() != "" && !($("input#character").is(":valid"))) {
      $(this).attr("disabled", "true");
      return;
    }

    var data = new Object();
    if($("input#SATVerbal").val() != "") data.SATVerbal = parseInt($("input#SATVerbal").val());
    if($("input#SATWriting").val() != "") data.SATWriting = parseInt($("input#SATWriting").val());
    if($("input#SATMath").val() != "") data.SATMath = parseInt($("input#SATMath").val());
    if($("input#GPA").val() != "") data.GPA = parseFloat($("input#GPA").val());
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

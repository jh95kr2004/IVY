$(function() {
  $("#cancelButton").click(function() {
    window.history.back();
  });

  if($("#familyType").prop("selectedIndex") <= 0
  || $("#siblingCount").prop("selectedIndex") <= 0
  || $("#parentsEducation").prop("selectedIndex") <= 0
  /*|| $("#ethnicity").prop("selectedIndex") <= 0
  || $("#veteranRelatives").prop("selectedIndex") <= 0*/)
    $("#saveButton").attr("disabled", "true");
  else
    $("#saveButton").removeAttr("disabled");

  $("#backgroundDiv .form-control").change(function() {
    if($("#familyType").prop("selectedIndex") <= 0
    || $("#siblingCount").prop("selectedIndex") <= 0
    || $("#parentsEducation").prop("selectedIndex") <= 0
    /*|| $("#ethnicity").prop("selectedIndex") <= 0
    || $("#veteranRelatives").prop("selectedIndex") <= 0*/)
      $("#saveButton").attr("disabled", "true");
    else
      $("#saveButton").removeAttr("disabled");
  });

  $("#saveButton").click(function() {
    if($("#familyType").prop("selectedIndex") <= 0
    || $("#siblingCount").prop("selectedIndex") <= 0
    || $("#parentsEducation").prop("selectedIndex") <= 0
    /*|| $("#ethnicity").prop("selectedIndex") <= 0
    || $("#veteranRelatives").prop("selectedIndex") <= 0*/) {
      $(this).attr("disabled", "true");
      return;
    }

    $.post(window.location, {
      familyTypeId: $("#familyType").val(),
      siblingCount: $("#siblingCount").val(),
      parentsEducationId: $("#parentsEducation").val(),
      /*ethnicity: $("#ethnicity").val(),
      veteranRelatives: $("#veteranRelatives").val()*/
    }).done(function(res) {
      if(res == 1) {
        alert("Updated successfully!");
        window.location =  "/consult/manage/" + $("#studentId").text();
      } else alert("You entered wrong data. Please check and re-try.");
    });
  });
});

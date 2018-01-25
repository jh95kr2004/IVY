$(function() {
  $("#nameDiv .form-control").keyup(function() {
    if(!($("#name").is(":valid")))
      $("#nextToBasicInformationButton").attr("disabled", "true");
    else
      $("#nextToBasicInformationButton").removeAttr("disabled");
  });

  $("#basicInformationDiv select.form-control").change(function() {
    if($("#activityType").prop("selectedIndex") > 0 && $("#activityDescription select:not(.d-none)").prop("selectedIndex") > 0 && $("#year").is(":valid"))
      $("#saveButton").removeAttr("disabled");
    else
      $("#saveButton").attr("disabled", "true");
  });

  $("select#activityType").change(function() {
    if($(this).prop("selectedIndex") == 0)
      $("select#activityTypeNone").removeClass("d-none").siblings("select").addClass("d-none");
    else {
      var select =  $("select#activityType" + $("#activityType option:selected").text().replace(/\s/g, ''))
      $(select).removeClass("d-none");
      $(select).siblings("select").addClass("d-none");
    }
    $("div#activityDescription label").animate({
      "color": "#CECECE",
    }, 100);
  });

  $("#basicInformationDiv input.form-control").keyup(function() {
    if($("#activityType").prop("selectedIndex") > 0 && $("#activityDescription select:not(.d-none)").prop("selectedIndex") > 0 && $("#year").is(":valid"))
      $("#saveButton").removeAttr("disabled");
    else
      $("#saveButton").attr("disabled", "true");
  });

  $("#cancelButton").click(function() {
    window.history.back();
  });

  $("#nextToBasicInformationButton").click(function() {
    if(!($("#name").is(":valid"))) {
      $(this).attr("disabled", "true");
      return;
    }
    $("#nameDiv").addClass("d-none");
    $("#basicInformationDiv").removeClass("d-none");
    $("#titleDiv span").text(" - Basic Information");
    $("#descriptionDiv").text("Enter basic information about the activity.");
  });

  $("#backToNameButton").click(function() {
    $("#basicInformationDiv").addClass("d-none");
    $("#nameDiv").removeClass("d-none");
    $("#titleDiv span").text("");
    $("#descriptionDiv").text("Enter the name of the activity.");
  });

  $("#saveButton").click(function() {
    if(!($("#name").is(":valid"))
    || $("#activityType").prop("selectedIndex") <= 0 || $("#activityDescription select:not(.d-none)").prop("selectedIndex") <= 0
    || !($("#year").is(":valid"))) {
      $(this).attr("disabled", "true");
      return;
    }

    $.post(window.location.href, {
      name: $("#name").val(),
      activityTypeId: $("#activityType").val(),
      activityDescriptionIndex: parseInt($("#activityDescription select:not(.d-none)").val()),
      semester: parseInt($("#semester").val()),
      year: parseInt($("#year").val()),
    }).done(function(data) {
      console.log(data);
      if(data.status == 1) {
        alert("Added new activity successfully!");
        window.location = data.url;
      } else alert("You entered wrong data. Please check and re-try.");
    });
  });
});

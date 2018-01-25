$(function() {
  $("#participationDiv select.form-control").change(function() {
    if($("#position").prop("selectedIndex") > 0 && $("#hoursPerWeek").is(":valid") && $("#hoursPerYear").is(":valid"))
      $("#nextToPortfolioImpactButton").removeAttr("disabled");
    else
      $("#nextToPortfolioImpactButton").attr("disabled", "true");
  });

  $("#participationDiv input.form-control").keyup(function() {
    if($("#position").prop("selectedIndex") > 0 && $("#hoursPerWeek").is(":valid") && $("#hoursPerYear").is(":valid"))
      $("#nextToPortfolioImpactButton").removeAttr("disabled");
    else
      $("#nextToPortfolioImpactButton").attr("disabled", "true");
  });

  $("#portfolioImpactDiv input.form-control").keyup(function() {
    if($("#leadership").is(":valid") && $("#communication").is(":valid") && $("#creativity").is(":valid") && $("#intelligence").is(":valid") && $("#selfMotivation").is(":valid"))
      $("#saveButton").removeAttr("disabled");
    else
      $("#saveButton").attr("disabled", "true");
  });

  $("#cancelButton").click(function() {
    window.history.back();
  });

  $("#nextToPortfolioImpactButton").click(function() {
    if(!($("#position").prop("selectedIndex") > 0 && $("#hoursPerWeek").is(":valid") && $("#hoursPerYear").is(":valid"))) {
      $(this).attr("disabled", "true");
      return;
    }
    $("#participationDiv").addClass("d-none");
    $("#portfolioImpactDiv").removeClass("d-none");
  });

  $("#backToParticipationButton").click(function() {
    $("#portfolioImpactDiv").addClass("d-none");
    $("#participationDiv").removeClass("d-none");
  });

  $("#saveButton").click(function() {
    if(!($("#position").prop("selectedIndex") > 0 && $("#hoursPerWeek").is(":valid") && $("#hoursPerYear").is(":valid")
    && $("#leadership").is(":valid") && $("#communication").is(":valid") && $("#creativity").is(":valid") && $("#intelligence").is(":valid") && $("#selfMotivation").is(":valid"))) {
      $(this).attr("disabled", "true");
      return;
    }

    $.post(window.location.href, {
      positionId: $("#position").val(),
      hoursPerWeek: parseInt($("#hoursPerWeek").val()),
      hoursPerYear: parseInt($("#hoursPerYear").val()),
      leadership: parseInt($("#leadership").val()),
      communication: parseInt($("#communication").val()),
      creativity: parseInt($("#creativity").val()),
      intelligence: parseInt($("#intelligence").val()),
      selfMotivation: parseInt($("#selfMotivation").val()),
    }).done(function(data) {
      console.log(data);
      if(data.status == 1) {
        alert("Added new activity successfully!");
        window.location = data.url;
      }
      else if(data.status == 0) alert("You entered wrong data. Please check and re-try.");
      else if(data.status == -1) alert("This activity is already added to this student.")
    });
  });
});

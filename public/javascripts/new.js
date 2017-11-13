$(function() {
  $(".form-control").keyup(function() {
    if(!($("#fullname").is(":valid")) || !($("#grade").is(":valid"))) {
      $("#nextButton").attr("disabled", "true");
    } else {
      $("#nextButton").removeAttr("disabled");
    }
  })

  $("#nextButton").click(function() {
    if(!($("#fullname").is(":valid")) || !($("#grade").is(":valid"))) {
      $(this).attr("disabled", "true");
      return;
    }
    $("#basicInfoDiv").addClass("d-none");
    $("#highSchoolDiv").removeClass("d-none");
    $("#newTitle").text("New Student - High School");
    $("#newDescription").text("Select the student's current high school.");
  });

  $(".resultContainer tr").click(function() {
    if($(this).hasClass("selected")) $("#saveButton").removeAttr("disabled");
    else $("#saveButton").attr("disabled", "true");
  })

  $("#backButton").click(function() {
    $("#highSchoolDiv").addClass("d-none");
    $("#basicInfoDiv").removeClass("d-none");
    $("#newTitle").text("New Student - Basic Info");
    $("#newDescription").text("Enter basic information about the student.");
  });

  $("#saveButton").click(function() {
    if(!($("#fullname").is(":valid")) || !($("#grade").is(":valid")) || $("tr.selected").length == 0) {
      $(this).attr("disabled", "true");
      return;
    }

    $.post("/consult/new", {
      name: $("#fullname").val(),
      grade: $("#grade").val(),
      highschool: $("tr.selected td.code").text()
    }).done(function(data) {
      if(data == 1) {
        alert("Added new student successfully!");
        window.location.replace("/consult");
      } else alert("You entered wrong data. Please check and re-try");
    });
  });
});

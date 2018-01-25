$(function() {
  $("#highSchoolSearch").val("");
  $("#highSchoolSearch").on("input", function() {
    $("#saveButton").attr("disabled", "true");
    if($(this).val() == "") {
      $("#highSchoolDiv table tbody").html("");
      return;
    }
    $.get("/consult/highschool", { keyword: $(this).val() })
    .done(function(data) {
      var tbody = $("#highSchoolDiv table tbody");
      $(tbody).html("");
      for(var i = 0; i < data.length; i++) {
        var tr = $("<tr></tr>");
        $(tr).html("<td>" + data[i]["name"] + "</td><td>" + data[i]["location"] + "</td><td class='code'>" + data[i]["_id"] + "</td>")
        $(tr).click(function() {
          if($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $("#saveButton").attr("disabled", "true");
          } else {
            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");
            $("#saveButton").removeAttr("disabled");
          }
        });
        $(tr).appendTo(tbody);
      }
    });
  });

  $(".form-control").keyup(function() {
    if(!($("#fullname").is(":valid")) || !($("#highschoolEntranceYear").is(":valid"))) {
      $("#nextButton").attr("disabled", "true");
    } else {
      $("#nextButton").removeAttr("disabled");
    }
  });

  $("#cancelButton").click(function() {
    window.history.back();
  });

  $("#nextButton").click(function() {
    if(!($("#fullname").is(":valid")) || !($("#highschoolEntranceYear").is(":valid"))) {
      $(this).attr("disabled", "true");
      return;
    }
    $("#basicInfoDiv").addClass("d-none");
    $("#highSchoolDiv").removeClass("d-none");
    $("#newTitle").text("New Student - High School");
    $("#newDescription").text("Select the student's current high school.");
  });

  $("#backButton").click(function() {
    $("#highSchoolDiv").addClass("d-none");
    $("#basicInfoDiv").removeClass("d-none");
    $("#newTitle").text("New Student - Basic Info");
    $("#newDescription").text("Enter basic information about the student.");
  });

  $("#saveButton").click(function() {
    if(!($("#fullname").is(":valid")) || !($("#highschoolEntranceYear").is(":valid")) || $("tr.selected").length == 0) {
      $(this).attr("disabled", "true");
      return;
    }

    $.post("/consult/new", {
      name: $("#fullname").val(),
      highschoolEntranceYear: parseInt($("#highschoolEntranceYear").val()),
      highschool: $("tr.selected td.code").text()
    }).done(function(data) {
      if(data == 1) {
        alert("Added new student successfully!");
        window.location = "/consult";
      } else alert("You entered wrong data. Please check and re-try.");
    });
  });
});

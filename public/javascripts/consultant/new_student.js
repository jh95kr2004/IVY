$(function() {
  $("#highSchoolSearch").val("");
  $("#highSchoolSearch").on("input", function() {
    $("#nextToContactInfoButton").attr("disabled", "true");
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
            $("#nextToContactInfoButton").attr("disabled", "true");
            $("#saveButton").attr("disabled", "true");
          } else {
            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");
            $("#nextToContactInfoButton").removeAttr("disabled");
            $("#saveButton").removeAttr("disabled");
          }
        });
        $(tr).appendTo(tbody);
      }
    });
  });

  $(".form-control").keyup(function() {
    if(!($("#fullname").is(":valid")) || !($("#highschoolEntranceYear").is(":valid"))) {
      $("#nextToHighSchoolButton").attr("disabled", "true");
      $("#saveButton").attr("disabled", "true");
    } else {
      $("#nextToHighSchoolButton").removeAttr("disabled");
      $("#saveButton").removeAttr("disabled");
    }
  });

  $(".form-control").change(function() {
    if(!($("#fullname").is(":valid")) || !($("#highschoolEntranceYear").is(":valid"))) {
      $("#nextToHighSchoolButton").attr("disabled", "true");
      $("#saveButton").attr("disabled", "true");
    } else {
      $("#nextToHighSchoolButton").removeAttr("disabled");
      $("#saveButton").removeAttr("disabled");
    }
  });

  $("#cancelButton").click(function() {
    window.history.back();
  });

  $("#nextToHighSchoolButton").click(function() {
    if(!($("#fullname").is(":valid")) || !($("#highschoolEntranceYear").is(":valid"))) {
      $(this).attr("disabled", "true");
      return;
    }
    $("#basicInfoDiv").addClass("d-none");
    $("#highSchoolDiv").removeClass("d-none");
    $("#detailTitle").text("High School");
    $("#newDescription").text("Select the student's current high school.");
  });

  $("#backToBasicInfoButton").click(function() {
    $("#highSchoolDiv").addClass("d-none");
    $("#basicInfoDiv").removeClass("d-none");
    $("#detailTitle").text("Basic Information");
    $("#newDescription").text("Enter basic information about the student.");
  });

  $("#nextToContactInfoButton").click(function() {
    if($("tr.selected").length == 0) {
      $(this).attr("disabled", "true");
      return;
    }
    $("#highSchoolDiv").addClass("d-none");
    $("#contactInfoDiv").removeClass("d-none");
    $("#detailTitle").text("Contact Information");
    $("#newDescription").text("Enter contact information of student.");
  });

  $("#backToHighSchoolButton").click(function() {
    $("#contactInfoDiv").addClass("d-none");
    $("#highSchoolDiv").removeClass("d-none");
    $("#detailTitle").text("High School");
    $("#newDescription").text("Select the student's current high school.");
  });

  $("#saveButton").click(function() {
    if(!($("#fullname").is(":valid")) || !($("#highschoolEntranceYear").is(":valid")) || $("tr.selected").length == 0) {
      $(this).attr("disabled", "true");
      return;
    }

    $.post("/consult/new", {
      name: $("#fullname").val(),
      highschoolEntranceYear: parseInt($("#highschoolEntranceYear").val()),
      highschool: $("tr.selected td.code").text(),
      studentsEmail: $("#studentsEmail").val(),
      studentsPhoneNumber: $("#studentsPhoneNumber").val(),
      studentsFacebook: $("#studentsFacebook").val(),
      studentsInstagram: $("#studentsInstagram").val(),
      parentsEmail: $("#parentsEmail").val(),
      parentsPhoneNumber: $("#parentsPhoneNumber").val()
    }).done(function(data) {
      if(data == 1) {
        alert("Added new student successfully!");
        window.location = "/consult";
      } else alert("You entered wrong data. Please check and re-try.");
    });
  });
});

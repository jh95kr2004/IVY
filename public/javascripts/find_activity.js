$(function() {
  $("#activitySearch").val("");
  $("#activitySearch").on("input", function() {
    $("#addButton").attr("disabled", "true");
    if($(this).val() == "") {
      $("#findActivityDiv table tbody").html("");
      return;
    }
    $.get("/consult/activity", { keyword: $(this).val() })
    .done(function(data) {
      var tbody = $("#findActivityDiv table tbody");
      $(tbody).html("");
      for(var i = 0; i < data.length; i++) {
        var tr = $("<tr></tr>");
        $(tr).html("<td>" + data[i]["name"] + "</td><td>" + /* data[i]["type"] + "</td><td>" + data[i]["description"] + "</td><td>" + */ data[i]["year"] + "</td><td>"
         + ((data[i]["semester"] == 1) ? "Spring-Summer" : "Fall-Winter") + "</td><td class='code'>" + data[i]["_id"] + "</td>")
        $(tr).click(function() {
          if($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $("#addButton").attr("disabled", "true");
          } else {
            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");
            $("#addButton").removeAttr("disabled");
          }
        });
        $(tr).appendTo(tbody);
      }
    });
  });

  $("#cancelButton").click(function() {
    window.location =  "/consult/manage/" + $("#studentId").text() + "/activities";
  });

  $("#addButton").click(function() {
    if($("table#activityList tr.selected").length == 0) {
      alert("Please select student.");
      return;
    }
    window.location = "/consult/manage/" + $("#studentId").text() + "/activities/add/" + $("table#activityList tr.selected td.code").text();
  });
});

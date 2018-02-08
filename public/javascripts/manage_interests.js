$(function() {
  $("#cancelButton").click(function() {
    window.history.back();
  });

  $("#saveButton").click(function() {
    var interests = [];
    $.each($("span.interest"), function(index, span) {
      interests.push($(span).text());
    });
    $.post(window.location, { "interests": interests }).done(function(res) {
      if(res == 1) {
        alert("Updated successfully!");
        window.location =  "/consult/manage/" + $("#studentId").text();
      } else alert("You entered wrong data. Please check and re-try.");
    });
  });

  $("#removeAllButton").click(function() {
    if(confirm("Are you sure to delete all interests?") == true) {
      $("span.interest").remove();
    }
  });

  $("input#interestInput").keyup(function(e) {
    if($(this).val() == "" && e.which == 8) {
      if($("span.interest.removeFocus").length == 0) $("span.interest").last().addClass("removeFocus");
      else $("span.interest.removeFocus").remove();
    } else $("span.interest.removeFocus").removeClass("removeFocus");
  });

  $("input#interestInput").keypress(function(e) {
    $("span.interest.removeFocus").removeClass("removeFocus");
    if(e.which == 44) {
      e.preventDefault();
      addInterest();
    }
  });

  $("div#interestsDiv").on("click", function() {
    $("input#interestInput").focus();
    $("span.interest.removeFocus").removeClass("removeFocus");
  });

  $("div#interestsDiv").on("focusout", function() {
    $("span.interest.removeFocus").removeClass("removeFocus");
    addInterest();
  });

  $("a.deleteButton").on("click", function(e) {
    e.preventDefault();
    $(this).parent().remove();
  });
});

function addInterest() {
  if($("input#interestInput").val() == "") return;
  var span = $("<span class='interest' contenteditable='false'></span>");
  var a = $("<a href='' class='deleteButton'></a>").on("click", function(e) {
    e.preventDefault();
    $(this).parent().remove();
  });
  $(span).text($("input#interestInput").val()).append(a).insertBefore($("input#interestInput"));
  $("input#interestInput").val("");
}

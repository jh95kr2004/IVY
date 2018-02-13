$(function() {
  $("#removeConsultantButton").click(function() {
    $.post("/admin/remove/", {
      consultantId: $("tr.selected td.code").text(),
    }).done(function(data) {
      location.reload();
    });
  });
});

$(function() {
  var creditChart;
  var data;
  var credits = new Array(8);

  $.get("/consult/manage/" + $("#studentId").text() + "/activities/list", {})
  .done(function(d) {
    data = d;
    if(!("leadership" in data.student.portfolio.basic)
    || !("communication" in data.student.portfolio.basic)
    || !("creativity" in data.student.portfolio.basic)
    || !("intelligence" in data.student.portfolio.basic)
    || !("motivation" in data.student.portfolio.basic)
    || !("character" in data.student.portfolio.basic)) {
      alert("Portfolio of this student is not complete. Please check basic ability section of student.")
      window.history.back();
    }
    for(var i = 0; i < 8; i++) {
      credits[i] = {
        "credit": 0.0,
        "leadership": 0.0,
        "communication": 0.0,
        "creativity": 0.0,
        "intelligence": 0.0,
        "selfMotivation": 0.0,
        "activities": []
      }
    }
    credits[0].credit = (parseInt(data.student.portfolio.basic.leadership)
    + parseInt(data.student.portfolio.basic.communication)
    + parseInt(data.student.portfolio.basic.creativity)
    + parseInt(data.student.portfolio.basic.intelligence)
    + parseInt(data.student.portfolio.basic.motivation)
    + parseInt(data.student.portfolio.basic.character)) / 6.0;
    credits[0].leadership = parseInt(data.student.portfolio.basic.leadership);
    credits[0].communication = parseInt(data.student.portfolio.basic.communication);
    credits[0].creativity = parseInt(data.student.portfolio.basic.creativity);
    credits[0].intelligence = parseInt(data.student.portfolio.basic.intelligence);
    credits[0].selfMotivation = parseInt(data.student.portfolio.basic.motivation);
    for(var i in data.student.portfolio.activities) {
      var activity = data.student.portfolio.activities[i];
      var creditIndex = (parseInt(data.activities[activity.activityId].year) - parseInt(data.student.highschoolEntranceYear)) * 2 + parseInt(data.activities[activity.activityId].semester) - 1;
      $("div#noSummary").addClass("d-none");
      $($("div#summaryDiv div.col-6")[creditIndex]).removeClass("d-none");
      if("leadership" in activity && "communication" in activity && "creativity" in activity && "intelligence" in activity && "selfMotivation" in activity
        && activity.leadership != null && activity.communication != null && activity.creativity != null && activity.intelligence != null && activity.selfMotivation != null
        && activity.leadership != NaN && activity.communication != NaN && activity.creativity != NaN && activity.intelligence != NaN && activity.selfMotivation != NaN) {
        credits[creditIndex].leadership += parseInt(activity.leadership);
        credits[creditIndex].communication += parseInt(activity.communication);
        credits[creditIndex].creativity += parseInt(activity.creativity);
        credits[creditIndex].intelligence += parseInt(activity.intelligence);
        credits[creditIndex].selfMotivation += parseInt(activity.selfMotivation);
        $($("div#summaryDiv div.col-6")[creditIndex]).find("ul").append("<li>" + data.activities[activity.activityId].name + " (" + data.activities[activity.activityId].year + ")</li>");
        credits[creditIndex].activities.push({activity: data.activities[activity.activityId], affect: true, index: i});
      } else {
        $($("div#summaryDiv div.col-6")[creditIndex]).find("ul").append("<li>" + data.activities[activity.activityId].name + " (" + data.activities[activity.activityId].year + ") *</li>");
        credits[creditIndex].activities.push({activity: data.activities[activity.activityId], affect: false, index: i});
      }
    }
    console.log(credits);
    for(var i = 1; i < 8; i++) {
      credits[i].leadership += credits[i - 1].leadership
      credits[i].communication += credits[i - 1].communication
      credits[i].creativity += credits[i - 1].creativity
      credits[i].intelligence += credits[i - 1].intelligence
      credits[i].selfMotivation += credits[i - 1].selfMotivation
      credits[i].credit = (credits[i].leadership + credits[i].communication + credits[i].creativity + credits[i].intelligence + credits[i].selfMotivation) / 5.0;
    }
    creditChart = bb.generate({
      bindto: "#creditChart",
      data: {
        colors :{
          credit: "#FFFFFF"
        },
        json: [
          {grade: 9.25, credit: credits[0].credit},
          {grade: 9.75, credit: credits[1].credit},
          {grade: 10.25, credit: credits[2].credit},
          {grade: 10.75, credit: credits[3].credit},
          {grade: 11.25, credit: credits[4].credit},
          {grade: 11.75, credit: credits[5].credit},
          {grade: 12.25, credit: credits[6].credit},
          {grade: 12.75, credit: credits[7].credit}
        ],
        keys: {
          x: "grade",
          value: ["credit"]
        },
        selection: {
          enabled: true,
          multiple: false
        },
        type: "scatter",
        labels: true,
        onover: function(d) {
          $("span#grade").text(Math.floor(d.index / 2) + 9 + "th grade");
          $("span#semester").text(d.index % 2 == 0 ? "(Spring - Summer)" : "(Fall - Winter)");
          $("ul#activityList").html("");
          for(let activity of credits[d.index].activities)
            $("<li></li>").html(activity.activity.name + " (" + activity.activity.year + ")" + ((activity.affect == false) ? " *" : "") + " <a href='/consult/manage/" + $("#studentId").text() + "/activities/edit/" + activity.index + "' class='editButton'>EDIT</a>").appendTo($("ul#activityList"));
        }
      },
      axis: {
        x: {
          min: 8.9,
          max: 13,
          label: "Grade",
          show: false
        },
        y: {
          min: 10,
          max: 90,
          label: "Credit",
          show: false
        }
      },
      legend: {
        show: false
      },
      grid: {
        x: {
          show: true,
          lines: [
            {value: 9, text: "9th grade", position: "start"},
            {value: 10, text: "10th grade", position: "start"},
            {value: 11, text: "11th grade", position: "start"},
            {value: 12, text: "12th grade", position: "start"},
            {value: 13, text: "Undergraduate", position: "start"}
          ]
        }
      },
      point: {
        r: 3,
        focus: {
          expand: {
            enabled: true,
            r: 5
          }
        },
        select: {
          r: 10
        }
      },
      tooltip: {
        show: false
      }
    });
  });

  $("#doneButton").click(function() {
    window.location =  "/consult/manage/" + $("#studentId").text();
  });
});

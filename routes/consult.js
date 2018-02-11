var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/IVY";

var authenticate = function(req, res, next) {
  if(req.session.user) {
    if(req.session.user.permission != 'consultant')
      res.layout('layout', {title:"IVY: No permission", head:""}, {body:{block:"caution", data:{title: "No Permission", description:"You don't have a permission to access consulting service."}}});
    else
      next();
  }
  else
    res.redirect('/login');
}

router.get('/', authenticate, function(req, res, next) {
  var studentsListHtml = "";
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("accounts").findOne({ email: req.session.user.email }, function(err, result) {
      db.collection("students").aggregate([
        {
          $match: { _id: { $in: result.students } }
        },
        {
          $lookup: {
            from: "highschools",
            let: { highschool_id: "$highschool" },
            pipeline: [
              { $match: { $expr: { $eq: [ "$_id", "$$highschool_id" ] } } },
              { $project: { _id: 0, location: 0 } }
            ],
            as: "highschool_name"
          }
        },
        {
          $sort: { name: 1 }
        }
      ]).toArray(function(err, result) {
        if(err) throw err;
        for(var student of result) {
          var grade = (new Date()).getFullYear() - parseInt(student.highschoolEntranceYear) + 9;
          if(grade > 12) grade = "Undergraduate";
          else grade += "th grade";
          studentsListHtml += "<tr><td>" + student.name + "</td><td>" + grade + "</td><td>" + student.highschool_name[0].name + "</td><td class='code'>" + student._id + "</td></tr>";
        }
        res.layout('layout', {title:"IVY: Consult", head:"<script src='/javascripts/consult.js'></script>"}, {body:{block:"consult", data:{students: studentsListHtml}}});
      });
    });
  });
});

var findStudent = function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("accounts").findOne({ email: req.session.user.email }, function(err, result) {
      if(err) throw err;
      var found = false;
      for(let student of result.students) {
        if(student.equals(req.params.studentId)) {
          found = true;
          break;
        }
      }
      if(found == false) {
        db.close();
        res.layout('layout', {title:"IVY: No permission", head:""}, {body:{block:"caution", data:{title: "No Permission", description:"You don't have permission to manage this student."}}});
        return;
      }
      db.collection("students").findOne({ _id: new ObjectID(req.params.studentId) }, function(err, result) {
        if(err) throw err;
        db.close();
        req.student = result;
        next();
      });
    });
  });
}

router.get('/manage/:studentId/', authenticate, findStudent, function(req, res, next) {
  res.layout('layout',
  {
    title: "IVY: Manage",
    head: "<script src='/javascripts/consult.js'></script><script src='/javascripts/manage.js'></script><link rel='stylesheet' href='/stylesheets/manage.css'>"
  },
  {
    body: {
      block: "manage",
      data: {
        studentName: req.student.name,
        studentId : req.student._id,
        memo: req.student.memo,
        description: ""
      }
    }
  });
});

router.post('/manage/:studentId/', authenticate, findStudent, function(req, res, next) {
  req.student.memo = req.body.memo;
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("students").replaceOne({ _id: req.student._id }, req.student, function(err, result) {
      if(err) throw err;
      db.close();
    });
  });
});

router.get('/manage/:studentId/memo', authenticate, findStudent, function(req, res, next) {
  res.send(req.student.memo);
});

router.get('/manage/:studentId/academic', authenticate, findStudent, function(req, res, next) {
  res.layout('layout',
  {
    title: "IVY: Academic Info",
    head: "<script src='/javascripts/manage_academic.js'></script>"
  },
  {
    body: {
      block: "manage_academic",
      data: {
        studentName: req.student.name,
        studentId: req.student._id,
        SATVerbal: ('SATVerbal' in req.student.portfolio.academic) ? parseInt(req.student.portfolio.academic.SATVerbal) : "",
        SATWriting: ('SATWriting' in req.student.portfolio.academic) ? parseInt(req.student.portfolio.academic.SATWriting) : "",
        SATMath: ('SATMath' in req.student.portfolio.academic) ? parseInt(req.student.portfolio.academic.SATMath) : "",
        GPA: ('GPA' in req.student.portfolio.academic) ? parseFloat(req.student.portfolio.academic.GPA) : ""
      }
    }
  });
});

router.post('/manage/:studentId/academic', authenticate, findStudent, function(req, res, next) {
  req.student.portfolio.academic = req.body;
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("students").replaceOne({ _id: req.student._id }, req.student, function(err, result) {
      if(err) throw err;
      db.close();
      res.send("1");
    });
  });
});

router.get('/manage/:studentId/basic', authenticate, findStudent, function(req, res, next) {
  res.layout('layout',
  {
    title: "IVY: Basic Ability",
    head: "<script src='/javascripts/manage_basicability.js'></script>"
  },
  {
    body: {
      block: "manage_basicability",
      data: {
        studentName: req.student.name,
        studentId: req.student._id,
        leadership: ('leadership' in req.student.portfolio.basic) ? parseInt(req.student.portfolio.basic.leadership) : "",
        communication: ('communication' in req.student.portfolio.basic) ? parseInt(req.student.portfolio.basic.communication) : "",
        creativity: ('creativity' in req.student.portfolio.basic) ? parseInt(req.student.portfolio.basic.creativity) : "",
        intelligence: ('intelligence' in req.student.portfolio.basic) ? parseInt(req.student.portfolio.basic.intelligence) : "",
        motivation: ('motivation' in req.student.portfolio.basic) ? parseInt(req.student.portfolio.basic.motivation) : "",
        character: ('character' in req.student.portfolio.basic) ? parseInt(req.student.portfolio.basic.character) : ""
      }
    }
  });
});

router.post('/manage/:studentId/basic', authenticate, findStudent, function(req, res, next) {
  req.student.portfolio.basic = req.body;
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("students").replaceOne({ _id: req.student._id }, req.student, function(err, result) {
      if(err) throw err;
      db.close();
      res.send("1");
    });
  });
});

router.get('/manage/:studentId/candidate', authenticate, findStudent, function(req, res, next) {
  var candidateHtmls = new Array(3);
  var ordinalStrings = ['First', 'Second', 'Third'];
  var colleges = {};
  var majors = {};
  MongoClient.connect(url, function(err, db) {
    db.collection("colleges").find({}).sort({name: 1}).toArray(function(err, result) {
      if(err) throw err;
      for(let college of result) colleges[college._id] = college;
      db.collection("majors").find({}).sort({major: 1}).toArray(function(err, result) {
        if(err) throw err;
        db.close();
        for(let major of result) majors[major._id] = major;
        for(var i = 0; i < 3; i++) {
          if(req.student.portfolio.candidate[i] == null) candidateHtmls[i] = '<td colspan=3><a href="/consult/manage/' + req.student._id + '/candidate/' + i + '">Select ' + ordinalStrings[i] + ' Candidate</a></td>';
          else candidateHtmls[i] = '<td class="schoolName">' + colleges[req.student.portfolio.candidate[i].schoolId].name +'</td><td class="majorName">' + majors[req.student.portfolio.candidate[i].majorId].major + '</td><td class="changeButton"><a href="/consult/manage/' + req.student._id + '/candidate/' + i + '">CHANGE</a></td>'
        }
        res.layout('layout',
        {
          title: "IVY: Candidate Schools",
          head: "<link rel='stylesheet' href='/stylesheets/manage_candidateschools.css'>"
        },
        {
          body: {
            block:"manage_candidateschools",
            data: {
              studentName: req.student.name,
              studentId: req.student._id,
              firstCandidate: candidateHtmls[0],
              secondCandidate: candidateHtmls[1],
              thirdCandidate: candidateHtmls[2]
            }
          }
        });
      });
    });
  });
});

router.get('/manage/:studentId/candidate/:candidate', authenticate, findStudent, function(req, res, next) {
  var ordinalStrings = ['First', 'Second', 'Third'];
  var schoolNamesHtml = "";
  var majorsHtml = "";

  MongoClient.connect(url, function(err, db) {
    db.collection("colleges").find({}).sort({name: 1}).toArray(function(err, result) {
      if(err) throw err;
      for(var i in result) schoolNamesHtml += '<option value="' + result[i]._id + '">' + result[i].name + '</option>';
      db.collection("majors").find({}).sort({major: 1}).toArray(function(err, result) {
        if(err) throw err;
        db.close();
        for(var i in result) majorsHtml += '<option value="' + result[i]._id + '">' + result[i].major + '</option>';
        res.layout('layout',
        {
          title: "IVY: Candidate Schools",
          head: '<script src="/javascripts/select_candidateschool.js"></script>'
        },
        {
          body: {
            block:"select_candidateschool",
            data: {
              studentName: req.student.name,
              studentId: req.student._id,
              ordinalString: ordinalStrings[parseInt(req.params.candidate)],
              schoolNames: schoolNamesHtml,
              majors: majorsHtml
            }
          }
        });
      });
    });
  });
});

router.post('/manage/:studentId/candidate/:candidate', authenticate, findStudent, function(req, res, next) {
  req.student.portfolio.candidate[parseInt(req.params.candidate)] = {
    schoolId: req.body.schoolId,
    majorId: req.body.majorId
  };
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("students").replaceOne({ _id: req.student._id }, req.student, function(err, result) {
      if(err) throw err;
      db.close();
      res.send("1");
    });
  });
});

router.get('/manage/:studentId/background', authenticate, findStudent, function(req, res, next) {
  var familyTypesHtml = "";
  var siblingCountHtml = "";
  var parentsEducationLevelHtml = "";
  var parentsEducationSchoolHtml = "";
  var parentsEducationMajorHtml = "";
  var ethnicitiesHtml = "";
  var veteranRelativesHtml = "";
  MongoClient.connect(url, function(err, db) {
    db.collection("family_types").find({}).sort({type: 1}).toArray(function(err, result) {
      if(err) throw err;
      for(var i in result)
        familyTypesHtml += '<option value="' + result[i]._id + '" ' + ((req.student.portfolio.background.familyTypeId == result[i]._id) ? "selected" : "") + '>' + result[i].type + '</option>';
      db.collection("parents_educations").find({}).sort({education: 1}).toArray(function(err, result) {
        if(err) throw err;
        for(var i in result)
          parentsEducationLevelHtml += '<option value="' + result[i]._id + '" ' + ((req.student.portfolio.background.parentsEducationLevelId == result[i]._id) ? "selected" : "") + '>' + result[i].education + '</option>';
        parentsEducationLevelHtml += '<option value="Other"' + ((req.student.portfolio.background.parentsEducationLevelId == "Other") ? "selected" : "") + '>' + 'Other...' + '</option>';
        db.collection("colleges").find({}).sort({name: 1}).toArray(function(err, result) {
          if(err) throw err;
          for(var i in result)
            parentsEducationSchoolHtml += '<option value="' + result[i]._id + '" ' + ((req.student.portfolio.background.parentsEducationSchoolId == result[i]._id) ? "selected" : "") + '>' + result[i].name + '</option>';
          parentsEducationSchoolHtml += '<option value="Other"' + ((req.student.portfolio.background.parentsEducationSchoolId == "Other") ? "selected" : "") + '>' + 'Other...' + '</option>';
          db.collection("majors").find({}).sort({major: 1}).toArray(function(err, result) {
            if(err) throw err;
            db.close();
            for(var i in result)
              parentsEducationMajorHtml += '<option value="' + result[i]._id + '" ' + ((req.student.portfolio.background.parentsEducationMajorId == result[i]._id) ? "selected" : "") + '>' + result[i].major + '</option>';
            parentsEducationMajorHtml += '<option value="Other"' + ((req.student.portfolio.background.parentsEducationMajorId == "Other") ? "selected" : "") + '>' + 'Other...' + '</option>';
            for(var i = 1; i <= 5; i++)
              siblingCountHtml += '<option value="' + i + '" ' + ((req.student.portfolio.background.siblingCount == i) ? "selected" : "") + '>' + i + '</option>';
            siblingCountHtml += '<option value="6" ' + ((req.student.portfolio.background.siblingCount == 6) ? "selected" : "") + '>' + "6+" + '</option>';
            res.layout('layout',
            {
              title: "IVY: Background",
              head: "<script src='/javascripts/manage_background.js'></script>"
            },
            {
              body: {
                block: "manage_background",
                data: {
                  studentName: req.student.name,
                  studentId: req.student._id,
                  familyTypes: familyTypesHtml,
                  siblingCount: siblingCountHtml,
                  parentsEducationLevel: parentsEducationLevelHtml,
                  parentsEducationSchool: parentsEducationSchoolHtml,
                  parentsEducationMajor: parentsEducationMajorHtml,
                  ethnicities: ethnicitiesHtml,
                  veteranRelatives: veteranRelativesHtml
                }
              }
            });
          });
        });
      });
    });
  });
});

router.post('/manage/:studentId/background', authenticate, findStudent, function(req, res, next) {
  req.student.portfolio.background = {
    familyTypeId: req.body.familyTypeId,
    siblingCount: parseInt(req.body.siblingCount),
    parentsEducationLevelId: req.body.parentsEducationLevelId,
    parentsEducationSchoolId: req.body.parentsEducationSchoolId,
    parentsEducationMajorId: req.body.parentsEducationMajorId
  };
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("students").replaceOne({ _id: req.student._id }, req.student, function(err, result) {
      if(err) throw err;
      db.close();
      res.send("1");
    });
  });
});

router.get('/manage/:studentId/activities', authenticate, findStudent, function(req, res, next) {
  var activitiesListHtml = "";
  var studentActivities = [];
  var types = {};
  var activities = {};
  var semesters = ["", "Spring/Summer", "Fall/Winter"];
  for(var activity of req.student.portfolio.activities)
    studentActivities.push(activity.activityId);
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("activities").aggregate([
      {
        $match: { _id: { $in: studentActivities } }
      }
    ]).toArray(function(err, result) {
      if(err) throw err;
      for(let activity of result) activities[activity._id] = activity;
      db.collection("activity_types").find({}).toArray(function(err, result) {
        if(err) throw err;
        db.close();
        for(let type of result) types[type._id] = type;
        for(var i in studentActivities)
          activitiesListHtml += "<tr><td>" + activities[studentActivities[i]].name + "</td><td>" + types[activities[studentActivities[i]].typeId].type + "</td><td>" + activities[studentActivities[i]].year + "</td><td>" + semesters[activities[studentActivities[i]].semester] + "</td><td class='code'>" + i + "</td></tr>";
        res.layout('layout',
        {
          title: "IVY: Activities",
          head: "<script src='/javascripts/manage_activities.js'></script>"
        },
        {
          body: {
            block: "manage_activities",
            data: {
              studentName: req.student.name,
              studentId: req.student._id,
              activities: activitiesListHtml
            }
          }
        });
      });
    });
  });
});

router.get('/manage/:studentId/activities/list', authenticate, findStudent, function(req, res, next) {
  var activityIdList = [];
  var activities = {};
  for(let activity of req.student.portfolio.activities)
    activityIdList.push(activity.activityId);
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("activities").aggregate([
      {
        $match: { _id: { $in: activityIdList } }
      },
      {
        $project: { students: 0 }
      }
    ]).toArray(function(err, result) {
      if(err) throw err;
      for(let activity of result)
        activities[activity._id] = activity;
      res.json({
        student: req.student,
        activities: activities
      });
    });
  });
});

router.get('/manage/:studentId/activities/find', authenticate, findStudent, function(req, res, next) {
  res.layout('layout',
  {
    title: "IVY: Find Activity",
    head: '<script src="/javascripts/find_activity.js"></script>'
  },
  {
    body: {
      block:"find_activity",
      data: {
        studentName: req.student.name,
        studentId: req.student._id
      }
    }
  });
});

router.get('/manage/:studentId/activities/new', authenticate, findStudent, function(req, res, next) {
  var activityTypesHtml = "";
  var activityDescriptionsHtml = "";
  MongoClient.connect(url, function(err, db) {
    db.collection("activity_types").find({}).sort({type: 1}).toArray(function(err, result) {
      if(err) throw err;
      db.close();
      for(var i in result) {
        activityTypesHtml += '<option value="' + result[i]._id + '">' + result[i].type + '</option>';
        activityDescriptionsHtml += '<select class="custom-select form-control d-none" id="activityType' + result[i].type.replace(/\s/g, '') + '"><option selected>Choose...</option>';
        for(var j in result[i].descriptions) {
          if('delete' in result[i].descriptions[j] && result[i].descriptions[j].delete == true) continue;
          activityDescriptionsHtml += '<option value="' + j + '">' + result[i].descriptions[j].description + '</option>';
        }
        activityDescriptionsHtml += '</select>';
      }
      res.layout('layout',
      {
        title: "IVY: New Activity",
        head: '<script src="/javascripts/new_activity.js"></script>'
      },
      {
        body: {
          block: "new_activity",
          data: {
            activityTypes: activityTypesHtml,
            activityDescriptions: activityDescriptionsHtml
          }
        }
      });
    });
  });
});

function checkActivityType(type) {
}

function checkActivityDescription(description) {
}

router.post('/manage/:studentId/activities/new', authenticate, findStudent, function(req, res, next) {
  if(req.body.name.length == 0 || req.body.year < 2014) res.json({ status: 0 });
  else {
    var activity = {
      name: req.body.name,
      typeId: req.body.activityTypeId,
      descriptionIndex: parseInt(req.body.activityDescriptionIndex),
      semester: parseInt(req.body.semester),
      year: parseInt(req.body.year),
      students: []
    };
    MongoClient.connect(url, function(err, db) {
      if(err) throw err;
      db.collection("activities").insertOne(activity, function(err, result) {
        if(err) throw err;
        db.close();
        res.json({ status: 1, url: "/consult/manage/" + req.student._id + "/activities/add/" + result.insertedId });
      })
    });
  }
});

var findActivity = function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("activities").findOne({ _id: new ObjectID(req.params.activityId) }, function(err, result) {
      if(err) throw err;
      db.close();
      if(result == null) {
        res.layout('layout', {title:"IVY: Unavailable Activity", head:""}, {body:{block:"caution", data:{title: "Unavailable Activity", description:"You are accessing unavailable activity."}}});
        return;
      }
      else req.activity = result;
      next();
    });
  });
}

router.get('/manage/:studentId/activities/add/:activityId', authenticate, findStudent, findActivity, function(req, res, next) {
  var activityPositionsHtml = "";
  MongoClient.connect(url, function(err, db) {
    db.collection("activity_positions").find({}).sort({position: 1}).toArray(function(err, result) {
      if(err) throw err;
      db.close();
      for(var i in result)
        activityPositionsHtml += '<option value="' + result[i]._id + '">' + result[i].position + '</option>';
      res.layout('layout',
      {
        title: "IVY: Add Activity",
        head: '<script src="/javascripts/add_activity.js"></script>'
      },
      {
        body: {
          block: "add_activity",
          data: {
            title: "Add Activity",
            studentName: req.student.name,
            studentId: req.student._id,
            activityName: req.activity.name,
            activityYear: req.activity.year,
            activityId: req.activity._id,
            hoursPerWeek: "",
            hoursPerYear: "",
            leadership: "",
            communication: "",
            creativity: "",
            intelligence: "",
            selfMotivation: "",
            activityPositions: activityPositionsHtml
          }
        }
      });
    });
  });
});

router.post('/manage/:studentId/activities/add/:activityId', authenticate, findStudent, findActivity, function(req, res, next) {
  for(var student of req.activity.students) {
    if(student.equals(req.student._id)) {
      res.json({ status: -1 });
      return;
    }
  }
  var activity = {
    activityId: req.activity._id,
    positionId: req.body.positionId,
    hoursPerWeek: parseInt(req.body.hoursPerWeek),
    hoursPerYear: parseInt(req.body.hoursPerYear),
    leadership: parseInt(req.body.leadership),
    communication: parseInt(req.body.communication),
    creativity: parseInt(req.body.creativity),
    intelligence: parseInt(req.body.intelligence),
    selfMotivation: parseInt(req.body.selfMotivation)
  };
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("students").updateOne({_id: new ObjectID(req.student._id)}, {$push: { "portfolio.activities": activity}}, function(err, result) {
      if(err) throw err;
      db.collection("activities").updateOne({_id: new ObjectID(req.activity._id)}, {$push: { students: new ObjectID(req.student._id)}}, function(err, result) {
        if(err) throw err;
        db.close();
        res.json({ status: 1, url: "/consult/manage/" + req.student._id + "/activities" });
      });
    });
  });
});

router.get('/manage/:studentId/activities/edit/:activityIndex', authenticate, findStudent, function(req, res, next) {
  var activityPositionsHtml = "";
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("activities").findOne({ _id: new ObjectID(req.student.portfolio.activities[req.params.activityIndex].activityId) }, function(err, result) {
      if(err) throw err;
      req.activity = result;
      db.collection("activity_positions").find({}).sort({position: 1}).toArray(function(err, result) {
        if(err) throw err;
        db.close();
        for(let position of result)
          activityPositionsHtml += '<option value="' + position._id + '" ' + ((position._id.equals(req.student.portfolio.activities[req.params.activityIndex].positionId)) ? "selected" : "") + '>' + position.position + '</option>';
        res.layout('layout',
        {
          title: "IVY: Edit Activity",
          head: '<script src="/javascripts/edit_activity.js"></script>'
        },
        {
          body: {
            block: "add_activity",
            data: {
              title: "Edit Activity",
              studentName: req.student.name,
              studentId: req.student._id,
              activityName: req.activity.name,
              activityYear: req.activity.year,
              activityId: req.activity._id,
              hoursPerWeek: req.student.portfolio.activities[req.params.activityIndex].hoursPerWeek,
              hoursPerYear: req.student.portfolio.activities[req.params.activityIndex].hoursPerYear,
              leadership: req.student.portfolio.activities[req.params.activityIndex].leadership,
              communication: req.student.portfolio.activities[req.params.activityIndex].communication,
              creativity: req.student.portfolio.activities[req.params.activityIndex].creativity,
              intelligence: req.student.portfolio.activities[req.params.activityIndex].intelligence,
              selfMotivation: req.student.portfolio.activities[req.params.activityIndex].selfMotivation,
              activityPositions: activityPositionsHtml
            }
          }
        });
      });
    });
  });
});

router.post('/manage/:studentId/activities/edit/:activityIndex', authenticate, findStudent, function(req, res, next) {
  req.student.portfolio.activities[req.params.activityIndex].hoursPerWeek = parseInt(req.body.hoursPerWeek);
  req.student.portfolio.activities[req.params.activityIndex].hoursPerYear = parseInt(req.body.hoursPerYear);
  req.student.portfolio.activities[req.params.activityIndex].leadership = parseInt(req.body.leadership);
  req.student.portfolio.activities[req.params.activityIndex].communication = parseInt(req.body.communication);
  req.student.portfolio.activities[req.params.activityIndex].creativity = parseInt(req.body.creativity);
  req.student.portfolio.activities[req.params.activityIndex].intelligence = parseInt(req.body.intelligence);
  req.student.portfolio.activities[req.params.activityIndex].selfMotivation = parseInt(req.body.selfMotivation);
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("students").replaceOne({ _id: req.student._id }, req.student, function(err, result) {
      if(err) throw err;
      db.close();
      res.json({ status: 1, url: "/consult/manage/" + req.student._id + "/activities" });
    });
  });
});

router.get('/manage/:studentId/activities/remove/:activityIndex', authenticate, findStudent, function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("activities").updateOne({ _id: new ObjectID(req.student.portfolio.activities[req.params.activityIndex].activityId) }, { "$pull": { students: new ObjectID(req.params.studentId) } }, function(err, result) {
      if(err) throw err;
      req.student.portfolio.activities.splice(req.params.activityIndex, 1);
      db.collection("students").replaceOne({ _id: req.student._id }, req.student, function(err, result) {
        if(err) throw err;
        db.close();
        res.send("1");
      });
    });
  });
});

router.get('/manage/:studentId/interests', authenticate, findStudent, function(req, res, next) {
  var interestsHtml = "";
  for(let interest of req.student.portfolio.interests)
    interestsHtml += "<span class='interest' contenteditable='false'>" + interest + "<a href='' class='deleteButton'></a></span>"
  res.layout('layout',
  {
    title: "IVY: Interests",
    head: "<script src='/javascripts/manage_interests.js'></script><link rel='stylesheet' href='/stylesheets/manage_interests.css'>"
  },
  {
    body: {
      block: "manage_interests",
      data: {
        studentName: req.student.name,
        studentId: req.student._id,
        interests: interestsHtml
      }
    }
  });
});

router.post('/manage/:studentId/interests', authenticate, findStudent, function(req, res, next) {
  req.student.portfolio.interests = req.body["interests[]"];
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("students").replaceOne({ _id: req.student._id }, req.student, function(err, result) {
      if(err) throw err;
      db.close();
      res.send("1");
    });
  });
});

router.get('/manage/:studentId/overview', authenticate, findStudent, function(req, res, next) {
  var candidateHtmls = new Array(3);
  var ordinalStrings = ['First', 'Second', 'Third'];
  var colleges = {};
  var majors = {};
  var familyTypesHtml = "";
  var siblingCountHtml = "";
  var parentsEducationLevelHtml = "";
  var parentsEducationSchoolHtml = "";
  var parentsEducationMajorHtml = "";
  var ethnicitiesHtml = "";
  var veteranRelativesHtml = "";
  var activitiesListHtml = "";
  var studentActivities = [];
  var activityTypes = {};
  var activities = {};
  var semesters = ["", "Spring/Summer", "Fall/Winter"];
  var interestsHtml = "";
  MongoClient.connect(url, function(err, db) {
    db.collection("colleges").find({}).sort({name: 1}).toArray(function(err, result) {
      if(err) throw err;
      for(let college of result) colleges[college._id] = college;
      db.collection("majors").find({}).sort({major: 1}).toArray(function(err, result) {
        if(err) throw err;
        for(let major of result) majors[major._id] = major;
        for(var i = 0; i < 3; i++) {
          if(req.student.portfolio.candidate[i] == null) candidateHtmls[i] = '<td colspan=2></td>';
          else candidateHtmls[i] = '<td class="schoolName">' + colleges[req.student.portfolio.candidate[i].schoolId].name +'</td><td class="majorName">' + majors[req.student.portfolio.candidate[i].majorId].major + '</td>';
        }
        db.collection("family_types").find({}).sort({type: 1}).toArray(function(err, result) {
          if(err) throw err;
          if("familyTypeId" in req.student.portfolio.background) {
          for(familyType of result)
            if(req.student.portfolio.background.familyTypeId == familyType._id)
              familyTypesHtml = familyType.type;
          } else familyTypesHtml = "";
          db.collection("parents_educations").find({}).sort({education: 1}).toArray(function(err, result) {
            if(err) throw err;
            if("parentsEducationLevelId" in req.student.portfolio.background) {
              if(req.student.portfolio.background.parentsEducationLevelId == "Other") parentsEducationLevelHtml = "Other";
              else {
                for(parentEducationLevel of result)
                  if(req.student.portfolio.background.parentsEducationLevelId == parentEducationLevel._id)
                    parentsEducationLevelHtml = parentEducationLevel.education
              }
            }
            if("parentsEducationSchoolId" in req.student.portfolio.background) {
              if(req.student.portfolio.background.parentsEducationSchoolId == "Other") parentsEducationSchoolHtml = "Other";
              else if(req.student.portfolio.background.parentsEducationSchoolId in colleges) parentsEducationSchoolHtml = colleges[req.student.portfolio.background.parentsEducationSchoolId].name;
            }
            if("parentsEducationMajorId" in req.student.portfolio.background) {
              if(req.student.portfolio.background.parentsEducationMajorId == "Other") parentsEducationMajorHtml = "Other";
              else if(req.student.portfolio.background.parentsEducationMajorId in majors) parentsEducationMajorHtml = majors[req.student.portfolio.background.parentsEducationMajorId].major;
            }
            if("siblingCount" in req.student.portfolio.background) {
              if(req.student.portfolio.background.siblingCount > 5) siblingCountHtml = "6+";
              else siblingCountHtml = req.student.portfolio.background.siblingCount;
            } else siblingCountHtml = "";
            for(var activity of req.student.portfolio.activities)
              studentActivities.push(activity.activityId);
            db.collection("activities").aggregate([
              {
                $match: { _id: { $in: studentActivities } }
              }
            ]).toArray(function(err, result) {
              if(err) throw err;
              for(let activity of result) activities[activity._id] = activity;
              db.collection("activity_types").find({}).toArray(function(err, result) {
                if(err) throw err;
                db.close();
                for(let type of result) activityTypes[type._id] = type;
                for(var i in studentActivities)
                activitiesListHtml += "<tr><td>" + activities[studentActivities[i]].name + " (" + activities[studentActivities[i]].year + ", " + semesters[activities[studentActivities[i]].semester] + ")" + "</td><td>" + activityTypes[activities[studentActivities[i]].typeId].type + "</td></tr>";
                for(let interest of req.student.portfolio.interests)
                  interestsHtml += "<span class='interest'>" + interest + "</span>"
                res.layout('layout',
                {
                  title:"IVY: Overview",
                  head:'<script src="/javascripts/overview.js"></script><link rel="stylesheet" href="/stylesheets/overview.css">'
                },
                {
                  body: {
                    block:"overview",
                    data: {
                      studentName: req.student.name,
                      studentId: req.student._id,
                      SATVerbal: (("SATVerbal" in req.student.portfolio.academic) ? req.student.portfolio.academic.SATVerbal : ""),
                      SATWriting: (("SATWriting" in req.student.portfolio.academic) ? req.student.portfolio.academic.SATWriting : ""),
                      SATMath: (("SATMath" in req.student.portfolio.academic) ? req.student.portfolio.academic.SATMath : ""),
                      GPA: (("GPA" in req.student.portfolio.academic) ? req.student.portfolio.academic.GPA : ""),
                      firstCandidate: candidateHtmls[0],
                      secondCandidate: candidateHtmls[1],
                      thirdCandidate: candidateHtmls[2],
                      familyTypes: familyTypesHtml,
                      siblingCount: siblingCountHtml,
                      parentsEducationLevel: parentsEducationLevelHtml,
                      parentsEducationSchool: parentsEducationSchoolHtml,
                      parentsEducationMajor: parentsEducationMajorHtml,
                      activities: activitiesListHtml,
                      leadership: (("leadership" in req.student.portfolio.basic) ? req.student.portfolio.basic.leadership : ""),
                      communication: (("communication" in req.student.portfolio.basic) ? req.student.portfolio.basic.communication : ""),
                      creativity: (("creativity" in req.student.portfolio.basic) ? req.student.portfolio.basic.creativity : ""),
                      intelligence: (("intelligence" in req.student.portfolio.basic) ? req.student.portfolio.basic.intelligence : ""),
                      motivation: (("motivation" in req.student.portfolio.basic) ? req.student.portfolio.basic.motivation : ""),
                      character: (("character" in req.student.portfolio.basic) ? req.student.portfolio.basic.character : ""),
                      interests: interestsHtml,
                      memo: req.student.memo
                    }
                  }
                });
              });
            });
          });
        });
      });
    });
  });
});

router.post('/manage/:studentId/overview', authenticate, findStudent, function(req, res, next) {
  req.student.memo = req.body.memo;
  console.log(req.body.memo);
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("students").replaceOne({ _id: req.student._id }, req.student, function(err, result) {
      if(err) throw err;
      db.close();
    });
  });
});

router.get('/new', authenticate, function(req, res, next) {
  res.layout('layout', {title:"IVY: New Student", head:'<script src="/javascripts/new_student.js"></script>'}, {body:{block:"new_student"}});
});

router.post('/new', authenticate, function(req, res, next) {
  if(req.body.name.length == 0 || req.body.highschoolEntranceYear < 2012 || req.body.grade > 2099) res.send("0");
  else {
    var student = {
      name: req.body.name,
      highschoolEntranceYear: parseInt(req.body.highschoolEntranceYear),
      highschool: new ObjectID(req.body.highschool),
      portfolio: {
        academic: {},
        candidate: new Array(3),
        background: {},
        basic: {},
        activities: [],
        interests: []
      }
    };
    MongoClient.connect(url, function(err, db) {
      if(err) throw err;
      db.collection("students").insertOne(student, function(err, result) {
        if(err) throw err;
        db.collection("accounts").updateOne({ email: req.session.user.email }, { $push: { students: new ObjectID(result.insertedId) } }, function(err, result) {
          if(err) throw err;
          db.close();
          res.send("1");
        });
      })
    });
  }
});

router.get('/edit/:studentId', authenticate, findStudent, function(req, res, next) {
});

router.get('/highschool', authenticate, function(req, res, next) {
  var keyword = req.query.keyword;
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("highschools").find({$or: [{name: { "$regex": keyword, "$options": "i"}}, {location: { "$regex": keyword, "$options": "i"}}]}).toArray(function(err, result) {
      res.send(result);
    });
  });
});

router.get('/activity', authenticate, function(req, res, next) {
  var keyword = req.query.keyword;
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("activities").find(
      {
        $or: [{
          name: {
            "$regex": keyword,
            "$options": "i"
          }
        }, /* {
          type: {
            "$regex": keyword,
            "$options": "i"
          }
        }, {
          description: {
            "$regex": keyword,
            "$options": "i"
          }
        },*/ {
          year: {
            "$regex": keyword,
            "$options": "i"
          }
        }]
      }
    )
    .toArray(function(err, result) {
      res.send(result);
    });
  });
});

module.exports = router;

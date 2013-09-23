
var upstart = require('./lib/upstart-events');
var spawn = require('child_process').spawn;
var nodemailer = require("nodemailer");
var os = require("os");
var config = require("./config.js");
console.log(config);
var listenForKill =  function(job, cb){
  upstart.on(job, function(state){
    if(state !== "killed") return;
    console.log("got kill");

    cb();
  });
}

var getTail = function(filename, lines, cb){
  var tail = spawn('tail', ['-n', lines, filename]);
  var fileLines = '';
  tail.stdout.setEncoding('utf8');
  tail.stdout.on('data', function (data){
    fileLines = fileLines + data;
  });
  tail.on('close', function(){
    cb(fileLines);
  });
}

var createMail = function(fileLines, job){
  var time = new Date().toUTCString();
  var mailOptions = {
    from: "WebRTC Ops <" + config.user + ">",
    to: config.toemail,
    subject: "Process Killed: " + job.name + " " + time,
    text: "A process you care about may have been killed \n\n" + 
      "process name: " + job.name + " \n" +
      "time : " + time + " \n" +
      "host : " + os.hostname() + " \n" +
      "log file: " + job.logfile + " \n\n" + fileLines
  }
  var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: config.user,
      pass: config.password
    }
  });
  smtpTransport.sendMail(mailOptions, function(e, r){
    if(e){
      console.log(e);
    }else{
      console.log(mailOptions);
      console.log("Sent an alert email", r);
    }
  });
}

var jobList = config.jobList;

jobList.forEach(function (job){
  console.log('Subscribing to job', job);
  listenForKill(job.name, function(){
    getTail(job.logfile, 60, function(lines){
      createMail(lines, job);
    });
  });
});

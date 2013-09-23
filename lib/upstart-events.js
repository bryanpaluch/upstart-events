var EventEmitter = require("events").EventEmitter;
var util = require("util");
var dbus = require('dbus-native');

function UpstartEvents(){
  this.bus = dbus.systemBus();
  this.bus.addMatch("type='signal', interface='com.ubuntu.Upstart0_6'");
  this.bus.addMatch("type='signal'");
  this.bus.connection.on('message', this._handleBusMessage.bind(this));

}

util.inherits(UpstartEvents, EventEmitter);


UpstartEvents.prototype._handleBusMessage = function(msg){
  var path = msg.path;
  
  if(msg.interface === 'com.ubuntu.Upstart0_6.Instance'){
    var jobName = path.split("/")[5];
    var eventName = msg.body[0];
    this.emit(jobName, eventName); 
  }

}

var instance = new UpstartEvents();

module.exports = instance;

var dbus = require('dbus-native');

var bus = dbus.systemBus();
//bus.connection.on('message', console.log);
bus.addMatch("type='signal'");

var upstart = bus.getService('com.ubuntu.Upstart');
upstart.getInterface('/com/ubuntu/Upstart', 'com.ubuntu.Upstart0_6', function(err, e){
  console.log('got interface');
  console.log(err, e);
  e.on('EventEmitted', function(msg, msg1){
    console.log(msg, msg1);
  });
  e.on('StateChanged', function(msg, msg1){
    console.log("StateChanged");
    console.log(msg, msg1);
  });

});

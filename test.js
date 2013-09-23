
var getEnd = require('./lib/read-end');
console.log("reading file");
getEnd('/var/log/withfriends.log', 10, function(e, text){
    console.log("got the end ===================");
    if(e) console.log( e);
    console.log(text);
    console.log("fin -================");
});

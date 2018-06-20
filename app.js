const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');
const mongoose = require('mongoose');
let Student = require("./models/student");

// init nexmo
const nexmo = new Nexmo({
  apiKey: 'ca32acc4',
  apiSecret: 'g1azr9FmDB6DYZss'
}, {debug:true});

mongoose.connect("mongodb://localhost/nodesms");

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  // res.render('index');
  Student.find({}, function(err,students){
    res.json({students: students});
  });
  let noStudents = 0;
  let name, number;
  Student.find({}, function(err, students) {
    if(err)
      console.log(err);
    else{
      noStudents = students.length;

      for(var i = 0; i < noStudents; i++){
        name = students[i].name;
        Student.findOne({name:name}, function(err, student) {
          nexmo.message.sendSms(
            '12345678901', student.mobile, student.name, { type: 'unicode'}, function(err, responseData){
              if(err){
                console.log(err);
              } else{
                console.dir(responseData);
                // get data from responseData
                const data = {
                  id: responseData.messages[0]['message-id'],
                  number: responseData.messages[0]['to']
                }

                // emit to the client
                io.emit('smsStatus', data);
              }
            }
          );
        });
      }
    }
  });
});

// catch form submit
app.post('/', function(req, res) {
  // res.send(req.body);
  // console.log(req.body);
  const number = req.body.number;
  const text = req.body.text;

  nexmo.message.sendSms(
    '12345678901', number, text, { type: 'unicode'}, function(err, responseData){
      if(err){
        console.log(err);
      } else{
        console.dir(responseData);
        // get data from responseData
        const data = {
          id: responseData.messages[0]['message-id'],
          number: responseData.messages[0]['to']
        }

        // emit to the client
        io.emit('smsStatus', data);
      }
    }
  );
});

const port = 3000;
const server = app.listen(port, () => console.log('Server started on port ' + port));

// connect to socket.io
const io = socketio(server);
io.on('connnection', function(socket){
  console.log('Connected');
  io.on('disconnect', function() {
    console.log('Disconnected')
  })
});

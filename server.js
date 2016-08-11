var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
// Serverinstanz
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);



mongoose.connect(config.database, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("Connected to the database");
    }
});

//Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/www'));

var api = require('./app/routes/api')(app, express, io);
app.use('/api', api);

//Any routes response this file
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/www/index.html');
})

// Set Server to port 3000
http.listen(config.port, function(err) {
    if(err) console.log(err)
    else console.log("Listening on port 3000");
});
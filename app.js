var express = require('express'),
	app = express();

	
var http = require('http').Server(app);
var io = require('socket.io')(http);

var config = require('./config');
var userList = require('./moduls/user-module');

app.use(express.static('public'));

app.get('/hello', function(req, res){
  res.send('hello');
});

app.get('/user-list', function(req, res){
	res.send(userList);
})

io.on('connection', function(socket){
	console.log('a user connected' +' '+'socketId:' + socket.id);
	
	userList.addUser('new', socket.id);

	socket.emit('your id', {socketId: socket.id});
	
	socket.broadcast.emit('chat message', "a user connected");
	
	io.emit('user list changed', {newUserList : userList.users});
	
	socket.on('disconnect', function(){
		console.log('user disconnected' + 'id:' + socket.userId);
		userList.deleteUser(socket.id);
	});
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		socket.broadcast.emit('chat message', msg);
	});
	socket.on('change name', function(name){
		console.log('change name ' + 'id:'+ socket.id + ' ' + 'name: ' + name);
		userList.changeUserName(socket.id, name);
		io.emit('user list changed', {newUserList : userList.users});
	})
});

var server  = http.listen(process.env.PORT || config.values.port, function(){
	console.log('Express Server listening  onport %s', server.address().port);
	});
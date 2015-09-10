var users = { 
	"1":{name:"exemple",socketId:1}
};
			

var addUser = function(userName, socketId){
	users[socketId] = {name: userName, socketId: socketId};
}

var changeUserName = function(userId, newUserName){
	users[userId].name = newUserName;
}

var deleteUser= function(userId){
	delete users[userId];
}

exports.users = users;
exports.addUser = addUser;
exports.changeUserName = changeUserName;
exports. deleteUser = deleteUser;
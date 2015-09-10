var socket = io();

var model = {
	name:"empty",
	id:0,
	userList:{},
	isConntected: false
}

var errorBox;

$("#entering-screen form").submit(function(){
	event.preventDefault();
	var userName = $(this).find('input').val();
	
	if (userName===""|| userName.length<2){
		showError('user name is missing or too short');
	}
	
	joinServer(userName);
	toggleViews();
});

function joinServer(userName){
	model.name = userName;
	$("#user-name").text(model.name);
	
	socket.emit('change name', userName);
}

function toggleViews(){
	$("#chat-screen").slideToggle( "slow");
	$("#entering-screen").slideToggle( "slow");
	errorBox.hide();
}

function showError(errorMsg){
	errorBox.show();
	errorText.text(errorMsg);
}

$("#input-container button").click(function(){
	var msgItem = $('#input-container input');
	sendMessage(msgItem.val());
	msgItem.val('');
});

function sendMessage(msg){
	var message = {
		message: msg,
		name   : model.name
	}
	
	socket.emit('chat message', message);
	
	addMessage(message);
}

function addMessage(msg){
	$('#messages').append($('<li>').text(
	msg.name + ':' + msg.message));
}

function changeUserList(userList){
	$('#users').empty();
	for (user in userList){
		var meText="";
		if(user==model.id){
			meText="('me')"
		}
		$('#users').append($('<a>')
		.addClass("list-group-item")
		.attr("href", "#")
		.text(userList[user].name + meText));
	}
}

socket.on('chat message', function(msg){
    addMessage(msg);
  });
  
socket.on('user list changed', function(msg){
	changeUserList(msg.newUserList);
});

socket.on('your id', function(msg){
	model.id = msg.socketId;
})
  
 
$('#input-container input').keypress(function(e) {
  if(e.which == 13) {
	var msgItem = $('#input-container input');
	sendMessage(msgItem.val());
	msgItem.val('');
  }
});

$( document ).ready(function(){
	errorBox = $("#error");
	errorText = errorBox.find('[name=error-message]');
	
	$("form").submit(function(event) {
		event.preventDefault();
	});
	
	$("#user-name").text(model.name);
	$('#chat-screen').hide();
	errorBox.hide();
});
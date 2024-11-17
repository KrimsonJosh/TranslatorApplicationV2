var socket = io.connect('http://' + document.domain + ':' + location.port); //create var socket which connects to location

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('message', function(msg) { // gets chat messages and message element
    var chatMessages = document.getElementById('chat-messages');
    var messageElement = document.createElement('p');
    messageElement.innerHTML = msg;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // scrolls to newest message element
});

document.getElementById('send').onclick = function() {
    var messageInput = document.getElementById('message');
    var message = messageInput.value;
    socket.send(message); // send message to server
    messageInput.value = '';
};

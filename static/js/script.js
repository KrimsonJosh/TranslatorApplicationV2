$(document).ready(function() {
 
    var socket = io.connect('http://' + document.domain + ':' + location.port); // initialize socket


    $('#user-modal').show();

 
    $('#user-form').submit(function(event) {
        event.preventDefault();
        var username = $('#username').val().trim();
        var language = $('#language').val().trim().toLowerCase();

        if (username === '' || language === '') {
            alert('Please enter both username and language.');
            return;
        }

        console.log('Joining chat with username:', username, 'and language:', language);

        //Hide modal when user submits
        $('#user-modal').hide();
        $('#chat-container').show();

      
        socket.emit('join', { 'username': username, 'language': language });
    });

    //incoming messages
    socket.on('message', function(data) {
        console.log('Message received:', data);
        var message = '<p><strong>' + data.user + ':</strong> ' + data.msg + '</p>';
        $('#chat-messages').append(message);
        $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
    });

    // Handle status updates (user joins or leaves)
    socket.on('status', function(data) {
        console.log('Status update:', data);
        var status = '<p><em>' + data.msg + '</em></p>';
        $('#chat-messages').append(status);
        $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
    });

    // Send message on button click
    $('#send').click(function() {
        sendMessage();
    });

    // Send message on Enter key press
    $('#message').keypress(function(e) {
        if (e.which == 13) { 
            sendMessage();
        }
    });

    // Function to send message
    function sendMessage() {
        var message = $('#message').val().trim();
        if (message === '') {
            return;
        }

        console.log('Sending message:', message);

        // Emit message event
        socket.emit('message', { 'msg': message });

        // Clear the input field after sending a message
        $('#message').val('');
    }
});

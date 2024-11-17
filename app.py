import os 
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from deep_translator import GoogleTranslator

app = Flask(__name__)
app.config['SECRET_KEY'] = ''
socketio = SocketIO(app)


users = {}

def translate_message(message, target_lang):
    """
    Translates the given message to the target language.
    """
    try:
        return GoogleTranslator(source='auto', target=target_lang).translate(message)
    except Exception as e:
        print(f"Translation error: {e}")
        return message  #if error in translation then return original message

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def handle_join(data):
    username = data.get('username')
    language = data.get('language', 'en')  
    users[request.sid] = {'username': username, 'language': language}
    print(f"User joined: {username} with language: {language}")
    emit('status', {'msg': f"{username} has joined the chat."}, broadcast=True)

@socketio.on('message')
def handle_message(data):
    user = users.get(request.sid)
    if user:
        username = user['username']
        user_lang = user['language']
        message = data.get('msg')
        
        print(f"Message received from {username}: {message}")

        translated_msg = translate_message(message, 'en')
        print(f"Translated to English: {translated_msg}")
        
        for sid, user_info in users.items():
            target_lang = user_info['language']
            translated_to_user_lang = translate_message(translated_msg, target_lang)
            emit('message', {'user': username, 'msg': translated_to_user_lang}, room=sid)

@socketio.on('disconnect')
def handle_disconnect():
    """
    Handles user disconnection.
    """
    user = users.pop(request.sid, None)
    if user:
        username = user['username']
        print(f"User disconnected: {username}")
        emit('status', {'msg': f"{username} has left the chat."}, broadcast=True)



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    socketio.run(app, host='0.0.0.0', port=port, debug=True)

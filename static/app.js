const socket = io();

// Expanded emoji dictionary for meaningful combinations
const emojiMap = {
    happy: "😊🎉", sad: "😢💔", angry: "😡🔥", love: "❤️😍", confused: "🤔❓",
    excited: "🎉😄", bored: "😐😴", hopeful: "🌈✨", grateful: "🙏🌟", surprised: "😲🎊",
    anxious: "😟🌀", relaxed: "😌🛀", tired: "😴💤", proud: "😌🏆", curious: "🤨🔍",
    joyful: "😁🎊", mischievous: "😈🎉", overwhelmed: "😵🌊", peaceful: "☮️🌿",
    playful: "😜🎈", reflective: "🤔📖", grateful: "🙏✨", compassionate: "💞🤗",
    "I love": "❤️😍", "you make me": "😊💖", "I miss you": "💔😭", "happy birthday": "🎉🎂🎈",
    "good night": "🌙💤", "good morning": "☀️🌅", "congratulations": "🎉🏆", "thank you": "🙏❤️",
    "well done": "👏🏅", "see you soon": "👋😊", "I’m sorry": "😔🙏", "I’m excited": "😄🎉",
    "you’re amazing": "🌟👏", "be safe": "🛡️❤️", "good luck": "🍀🤞"
};

// Function to convert sentence into emojis
function convertToEmoji(sentence) {
    let emojiMessage = "";

    // Split the sentence into words and phrases
    const words = sentence.toLowerCase().split(" ");

    // Check for multi-word phrases in the sentence
    Object.keys(emojiMap).forEach(phrase => {
        if (sentence.toLowerCase().includes(phrase)) {
            emojiMessage += emojiMap[phrase] + " ";
        }
    });

    // Check for individual words in the sentence if no phrases matched
    if (!emojiMessage) {
        words.forEach(word => {
            if (emojiMap[word]) {
                emojiMessage += emojiMap[word] + " ";
            }
        });
    }

    // Fallback to original text if no emojis matched
    return emojiMessage.trim() || sentence;
}

function joinChat() {
    const username = document.getElementById('username').value;
    const room = document.getElementById('room').value;

    if (username && room) {
        socket.emit('join', { username, room });
        document.getElementById('homepage').style.display = 'none';
        document.getElementById('chat').style.display = 'flex';
    }
}

function leaveChat() {
    const username = document.getElementById('username').value;
    const room = document.getElementById('room').value;
    socket.emit('leave', { username, room });
    document.getElementById('homepage').style.display = 'flex';
    document.getElementById('chat').style.display = 'none';
}

function sendMessage() {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message-input').value;
    const room = document.getElementById('room').value;

    // Convert the message into a meaningful emoji combination
    const emojiMessage = convertToEmoji(message);

    if (message) {
        // Display the emoji combination in the chat as the sent message
        displaySentMessage(emojiMessage);

        // Emit only the emoji combination to other users in the room
        socket.emit('send_message', { username, message: emojiMessage, room });

        // Clear the input field
        document.getElementById('message-input').value = '';
    }
}

function displaySentMessage(emojiMessage) {
    const emojiContainer = document.getElementById('emoji-container');
    const newMessage = document.createElement('div');
    newMessage.className = 'user-message';
    newMessage.innerHTML = `<strong>You:</strong> ${emojiMessage}`;
    emojiContainer.appendChild(newMessage);

    // Auto-scroll to the bottom
    emojiContainer.scrollTop = emojiContainer.scrollHeight;
}

socket.on('receive_emoji', function(data) {
    if (data.username !== document.getElementById('username').value) {
        const emojiContainer = document.getElementById('emoji-container');
        const newMessage = document.createElement('div');
        newMessage.className = 'received-message';
        newMessage.innerHTML = `<strong>${data.username}:</strong> ${data.emoji}`;
        emojiContainer.appendChild(newMessage);

        // Auto-scroll to the bottom
        emojiContainer.scrollTop = emojiContainer.scrollHeight;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const chatBox = document.getElementById('chat-box');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    if (!chatBox || !chatForm || !chatInput) return;

    // applyChatTheme(); // Initial theme application
    // document.addEventListener('themeChanged', applyChatTheme); // Update on toggle

    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message === '') return;

        appendMessage('user', message);
        chatInput.value = '';

        // Send message to backend
        fetch('/send_message/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `message=${encodeURIComponent(message)}`
        }).then(() => {
            loadMessages(); // Refresh messages
        });

        // Optional fake response (for testing)
        setTimeout(() => {
            appendMessage('support', 'Thanks for reaching out! We\'ll get back to you shortly.');
        }, 800);
    });

    function loadMessages() {
        fetch('/get_messages/')
            .then(response => response.json())
            .then(data => {
                chatBox.innerHTML = '';
                data.messages.forEach(msg => {
                    const div = document.createElement('div');
                    div.className = 'chat-message';
    
                    if (msg.admin === 'me') {
                        div.innerHTML = `<strong>You</strong>: ${msg.text} - <small>${msg.timestamp}</small>`;
                        div.style.background = 'linear-gradient(120deg, #2c67f2,#53b4d4)';
                    } else if (msg.admin === 'admin') {
                        div.innerHTML = `<strong>Admin</strong>: ${msg.text} - <small>${msg.timestamp}</small>`;
                        div.style.background = 'linear-gradient(120deg, #53b4d4, #2c67f2)';
                    } else {
                        // fallback if neither match
                        div.innerHTML = `<strong>${msg.sender || 'Unknown'}</strong>: ${msg.text} - <small>${msg.timestamp}</small>`;
                    }
    
                    chatBox.appendChild(div);
                });
                chatBox.scrollTop = chatBox.scrollHeight;
            });
    }
    

    function appendMessage(sender, message) {
        const messageEl = document.createElement('div');
        messageEl.classList.add('chat-message', sender);
        messageEl.textContent = message;
        chatBox.appendChild(messageEl);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function applyChatTheme() {
        if (body.classList.contains('dark-mode')) {
            chatBox.style.backgroundColor = '#333333';
            chatBox.style.color = '#ffffff';
        } else {
            chatBox.style.backgroundColor = '#ffffff';
            chatBox.style.color = '#000000';
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Load messages immediately, and keep polling
    loadMessages();
    setInterval(loadMessages, 3000);
});


const chatBox = document.querySelector(".chat-box");
const inputField = chatBox.querySelector("input[type='text']");
const button = chatBox.querySelector("button");
const chatBoxBody = chatBox.querySelector(".chat-box-body");
const mic = document.getElementById("image");

button.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

mic.addEventListener("click", toggleRecording);

let recognition;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
} else {
  console.log("Speech Recognition Not Available");
}

let recording = false;

function toggleRecording() {
  if (!recording) {
    recognition.start();
    mic.src = './assets/Mic On.jpg';
    recognition.onresult = function(event) {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          inputField.value = event.results[i][0].transcript;
        }
      }
    };
    recording = true;
  } else {
    recognition.stop();
    mic.src = './assets/Mic Off.jpg';
    recording = false;
  }
}

function sendMessage() {
  const message = inputField.value;
  inputField.value = "";
  chatBoxBody.innerHTML += `<div class="message"><p>${message}</p></div>`;
  chatBoxBody.innerHTML += `<div id="loading" class="response loading">.</div>`;
  scrollToBottom();
  window.dotsGoingUp = true;
    var dots = window.setInterval( function() {
        var wait = document.getElementById("loading");
        if ( window.dotsGoingUp ) 
            wait.innerHTML += ".";
        else {
            wait.innerHTML = wait.innerHTML.substring(1, wait.innerHTML.length);
        if ( wait.innerHTML.length < 2)
            window.dotsGoingUp = true;
        }
        if ( wait.innerHTML.length > 3 )
            window.dotsGoingUp = false;
        }, 250);

  fetch('http://localhost:3000/message', {
    method: 'POST',
    headers: {
      accept: 'application.json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({message})
  }).then(response => {
    return response.json();
  }).then(data => {
    document.getElementById("loading").remove();
    chatBoxBody.innerHTML += `<div class="response"><p>${data.message}</p></div>`;
    scrollToBottom();
  })
}
function scrollToBottom() {
  chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
}


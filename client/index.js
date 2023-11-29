const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected to server");
  socket.emit("new-user-connected");
});

socket.on("user-connected", data => {
  document.getElementById("login-info").textContent = `logged in as ${data.name}`;

  console.log(data);

  for (let i = 0; i < data.otherUsers.length; i++) {
    race.innerHTML = `${race.innerHTML}
    <div class="row">
      <div class="track">
        <span>🏎️</span>
      </div>
      <div>
        <span>0 wpm</span>
        <span>${data.otherUsers[i]}</span>
      </div>
    </div>
    <div class="separator"></div>`;
  }
});

socket.on("broadcasted-user-connected", name => {
  const race = document.getElementById("race");

  race.innerHTML = `${race.innerHTML}
  <div class="row">
    <div class="track">
      <span>🏎️</span>
    </div>
    <div>
      <span>0 wpm</span>
      <span>${name}</span>
    </div>
  </div>
  <div class="separator"></div>`;
});

// socket.on("user-disconnected", name => {
//   appendMessage(`${name} disconnected`);
// });

// messageForm.addEventListener("submit", e => {
//   e.preventDefault();
//   const message = messageInput.value;
//   appendMessage(`You: ${message}`);
//   socket.emit("send-chat-message", message);
//   messageInput.value = "";
// });

// function appendMessage(message) {
//   const messageElement = document.createElement("div");
//   messageElement.innerText = message;
//   messageContainer.append(messageElement);
// }

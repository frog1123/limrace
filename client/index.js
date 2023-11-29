const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected to server");
  socket.emit("new-user-connected");
});

socket.on("user-connected", name => {
  document.getElementById("login-info").textContent = `Logged in as ${name}`;
});

socket.on("broadcasted-user-connected", name => {
  document.getElementById("other-users").textContent = `${document.getElementById("other-users").textContent} ${name}`;
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

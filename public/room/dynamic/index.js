const socket = io(window.length.origin);

socket.on("connect", () => {
  console.log("connected to server");

  const roomId = window.location.pathname.split("/").pop();
  socket.emit("join-room", roomId);
});

let roomUsers = [];
let words;
let currentWordIndex = 0;
let chars;
let totalChars;
let currentCharIndex = 0;
let virtualText = "";

socket.on("user-connected", data => {
  document.getElementById("room-info").textContent = `room ${data.room.id}`;
  document.getElementById("login-info").textContent = `logged in as ${data.name}`;

  words = data.room.text.split(" ").map((word, index, array) => {
    return index === array.length - 1 ? word : word + " ";
  });

  chars = data.room.text.split("");
  totalChars = chars.length;
  console.log("words: ", words);
  console.log("chars: ", chars);
  renderInitialText();

  roomUsers = data.users;
  renderUsers();
});

socket.on("broadcasted-user-connected", data => {
  roomUsers = [...roomUsers, data];
  renderUsers();
});

socket.on("broadcasted-user-disconnected", data => {
  roomUsers = roomUsers.filter(user => user.name !== data.name);
  renderUsers();
});

socket.on("broadcasted-word-completed", data => {
  console.log("data", data);

  const car = document.getElementById(`car-${data.name}`);
  const container = car.parentElement; // Assuming the container is the parent element

  const move = data.char / totalChars;

  // Calculate the maximum allowed position
  const maxPosition = container.offsetWidth - car.offsetWidth;

  // Calculate the new left position
  const newLeft = move * maxPosition;

  // Ensure the new position doesn't go beyond the container boundaries
  car.style.left = `${Math.min(maxPosition, Math.max(0, newLeft))}px`;
});

const renderUsers = () => {
  console.log(roomUsers);
  const race = document.getElementById("race");
  race.innerHTML = null;

  for (let i = 0; i < roomUsers.length; i++) {
    race.innerHTML = `${race.innerHTML}
    <div id="row-${roomUsers[i].name}" class="row">
      <div class="track">
        <div id="car-${roomUsers[i].name}" class="car">
          <span>${roomUsers[i].name}</span>
          <img src="/assets/red_car.svg" />
        </div>
      </div>
      <div>
        <span>0 wpm</span>
      </div>
    </div>
    <div id="separator-${roomUsers[i].name}" class="separator"></div>`;
  }
};

const renderInitialText = () => {
  const container = document.getElementById("text");

  chars.forEach(char => {
    const span = document.createElement("span");
    span.textContent = char;
    container.appendChild(span);
  });

  const caret = document.createElement("div");
  caret.classList.add("caret");
  caret.style.display = "none";
  container.appendChild(caret);

  updateCaretPosition();

  updatePlaceholder(0);
  highlightCurrentChar(0);
};

const updatePlaceholder = index => {
  const input = document.getElementById("input");
  input.placeholder = words[index];
  input.setAttribute("data-current-word", index);
};

const wordsContainer = document.getElementById("text").children;
const highlightCurrentChar = index => {
  for (let i = 0; i < wordsContainer.length; i++) {
    if (i === index) {
      wordsContainer[i].classList.add("current-char");
    } else {
      wordsContainer[i].classList.remove("current-char");
    }
  }
  updateCaretPosition();
};

let earliestIncorrectChar = Infinity;
const highlightCompletedChars = () => {
  console.log(currentCharIndex);

  for (let i = currentCharIndex - 1; i < wordsContainer.length; i++) {
    const word = wordsContainer[i];

    if (word.textContent === virtualText[i] && i < earliestIncorrectChar) {
      word.classList.remove("incorrect-char");
      word.classList.add("completed-char");
    } else {
      earliestIncorrectChar = i;
      word.classList.remove("completed-char");
      word.classList.add("incorrect-char");
    }
  }
};

const updateCaretPosition = () => {
  const currentCharElement = document.querySelector(".current-char");
  const caret = document.querySelector(".caret");

  if (currentCharElement && caret) {
    const rect = currentCharElement.getBoundingClientRect();
    const charTop = currentCharElement.offsetTop;

    const charWidth = currentCharElement.offsetWidth;
    caret.style.top = `${charTop}px`;
    caret.style.left = `${rect.right - charWidth}px`;
  }
};

let prevInput = "";
const input = document.getElementById("input");
input.addEventListener("input", () => {
  const caret = document.querySelector(".caret");
  caret.style.display = "block";

  highlightCurrentChar(currentCharIndex);

  const diff = input.value.length - prevInput.length;
  currentCharIndex += diff;
  highlightCurrentChar(currentCharIndex);

  if (diff > 0) {
    virtualText += input.value.substring(prevInput.length);
  } else if (diff < 0) {
    virtualText = virtualText.slice(0, diff);
  }

  if (input.value === words[currentWordIndex]) {
    input.value = "";
    currentWordIndex += 1;
    // currentCharIndex += words[currentWordIndex - 1].length;

    updatePlaceholder(currentWordIndex);
    socket.emit("word-completed", { char: currentCharIndex });

    if (currentWordIndex === words.length) {
      input.style.display = "none";
      document.getElementById("finish-text").style.display = "block";
      document.querySelector(".caret").style.display = "none";
    }
  }

  prevInput = input.value;
  updateCaretPosition();
  highlightCompletedChars();
});

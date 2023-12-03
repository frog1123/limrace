const codeInput = document.getElementById("code-input");
const joinRoomBtn = document.getElementById("join-room-btn");

codeInput.addEventListener("input", () => {
  codeInput.value = codeInput.value.replace(/\D/g, "");

  if (codeInput.value.length > 6) codeInput.value = codeInput.value.slice(0, 6);

  checkCodeInputValidity();
});

codeInput.addEventListener("keydown", e => {
  if (e.key === "Enter") join();
});

joinRoomBtn.onclick = () => join();

const checkCodeInputValidity = () => {
  const inputValue = codeInput.value;
  const isInputValid = inputValue.length === 6 && /^\d+$/.test(inputValue);

  if (isInputValid) joinRoomBtn.classList.remove("btn-disabled");
  else joinRoomBtn.classList.add("btn-disabled");
};

const join = () => {
  if (codeInput) {
    const inputValue = codeInput.value;
    if (inputValue.length !== 6 || !/^\d+$/.test(inputValue)) return;

    window.location.href = `/room/${codeInput.value}`;
  }
};

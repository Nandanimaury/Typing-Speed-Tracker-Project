const typingTest = document.querySelector('.text-of-typing p');
const inputField = document.querySelector('.input-field');
const errorTag = document.querySelector('.errors span');
const timeTag = document.querySelector('.time span');
const wpmTag = document.querySelector('.wpm span');
const cpmTag = document.querySelector('.cpm span');
const startButton = document.querySelector('.start-button'); // Select Start/Done button
const themeToggleButton = document.getElementById('theme-toggle'); // Dark mode button

const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Global demand for software developers is increasing rapidly.",
    "Typing speed is measured in words per minute."
];

let timer, maxTime = 60, timeLeft = maxTime;
let charIndex = 0, errors = 0, isTyping = false;
let isRunning = false; // Track the game state

// Function to select a random paragraph and reset values
function randomParagraph() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    typingTest.innerHTML = "";
    sentences[randomIndex].split("").forEach(char => {
        let spanTag = `<span>${char}</span>`;
        typingTest.innerHTML += spanTag;
    });
    typingTest.querySelectorAll('span')[0].classList.add('active');
    inputField.value = "";
    inputField.disabled = false;
    inputField.focus();
    timeLeft = maxTime;
    charIndex = errors = 0;
    timeTag.innerText = `${timeLeft}s`;
    errorTag.innerText = errors;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
}

// Function to handle typing input
function initTyping() {
    const characters = typingTest.querySelectorAll('span');
    const typedChar = inputField.value.split("")[charIndex];

    if (!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping = true;
    }

    if (typedChar == null) { // Handle Backspace
        if (characters[charIndex].classList.contains('incorrect')) {
            errors--;
        }
        characters[charIndex].classList.remove('correct', 'incorrect');
        charIndex--;
    } else {
        if (characters[charIndex].innerText === typedChar) {
            characters[charIndex].classList.add('correct');
        } else {
            errors++;
            characters[charIndex].classList.add('incorrect');
        }
        charIndex++;
    }

    characters.forEach(span => span.classList.remove('active'));
    if (charIndex < characters.length) {
        characters[charIndex].classList.add('active');
    }

    errorTag.innerText = errors;
    const correctChars = charIndex - errors;
    cpmTag.innerText = correctChars;

    const wpm = Math.round(((correctChars / 5) / (maxTime - timeLeft)) * 60);
    wpmTag.innerText = wpm > 0 ? wpm : 0;
}

// Timer function
function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = `${timeLeft}s`;
    } else {
        clearInterval(timer);
        inputField.disabled = true;
    }
}

// Toggle Start/Done button functionality
function toggleGame() {
    if (isRunning) {
        // When the game is running, stop it
        inputField.disabled = true;
        clearInterval(timer);
        startButton.innerText = "Start";
        isRunning = false;
    } else {
        // When the game is not running, start it
        resetGame();
        startButton.innerText = "Done";
        isRunning = true;
    }
}

// Reset the game
function resetGame() {
    clearInterval(timer);
    randomParagraph();
    isTyping = false;
    inputField.focus();
}

// Dark Mode toggle
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
});

// Apply saved theme on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Event Listeners
startButton.addEventListener('click', toggleGame); // Start/Done button
inputField.addEventListener('input', initTyping);

// Initialize the first random paragraph
randomParagraph();

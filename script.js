let chosenHorse = null;
let betAmount = 1;
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;

document.getElementById('high-score-value').textContent = highScore;
document.getElementById('coins').textContent = coins;
document.getElementById('bank-value').textContent = coins;

function showBettingScreen() {
    if (coins === 0) {
        coins = 10;
        localStorage.setItem('coins', coins);
        document.getElementById('coins').textContent = coins;
        document.getElementById('bank-value').textContent = coins;
        showNotification("10 coins added to bank.");
    } else {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('betting-screen').style.display = 'block';
        document.getElementById('bet-slider').max = coins; // Set max bet amount based on current balance
        document.getElementById('bet-slider').value = Math.min(1, coins); // Reset bet slider to 1 or the maximum available coins
        document.getElementById('available-balance').textContent = coins; // Update available balance
        updateBetAmount(); // Update displayed bet amount
    }
    updateStartButton();
}

function updateStartButton() {
    const startButton = document.querySelector('.start-button');
    if (coins === 0) {
        startButton.textContent = 'Add Coins';
    } else {
        startButton.textContent = 'Start Game';
    }
}

function updateBetAmount() {
    betAmount = document.getElementById('bet-slider').value;
    document.getElementById('bet-amount').textContent = betAmount;
}

function selectHorse(horse) {
    chosenHorse = horse;
    document.getElementById('chosen-horse').textContent = `Horse ${getHorseColor(horse)}`;
}

function startRace() {
    if (chosenHorse === null) {
        alert('Please select a horse!');
        return;
    }
    if (coins < betAmount) {
        alert('You do not have enough coins to place this bet!');
        return;
    }
    document.getElementById('betting-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('current-bet-amount').textContent = betAmount;
    document.getElementById('current-chosen-horse').textContent = getHorseColor(chosenHorse);
    coins -= betAmount; // Deduct bet amount from balance
    document.getElementById('coins').textContent = coins;
    document.getElementById('bank-value').textContent = coins; // Update bank value
    localStorage.setItem('coins', coins); // Save coins to localStorage
    resetRace();
    runRace();
}

function getHorseColor(horse) {
    switch (horse) {
        case 1: return 'Mr. Blue';
        case 2: return 'Red Rocket';
        case 3: return 'Green Thunder';
        case 4: return 'Pink Lightning';
        default: return 'None';
    }
}

function resetRace() {
    const horses = [
        document.getElementById('runner1'),
        document.getElementById('runner2'),
        document.getElementById('runner3'),
        document.getElementById('runner4')
    ];
    horses.forEach(horse => {
        horse.style.left = '0%';
    });
}

function runRace() {
    const horses = [
        document.getElementById('runner1'),
        document.getElementById('runner2'),
        document.getElementById('runner3'),
        document.getElementById('runner4')
    ];
    const finishLine = 90; // Percentage of the width of the race track

    // Increase speed for quicker testing
    const moveDistanceFactor = 2; // Increase move distance
    const intervalTime = 150; // Decrease interval time

    let raceInterval = setInterval(() => {
        let winner = null;
        horses.forEach((horse, index) => {
            let currentPos = parseFloat(horse.style.left || 0);
            let moveDistance = Math.random() * moveDistanceFactor;
            currentPos += moveDistance;
            horse.style.left = currentPos + '%';
            if (currentPos >= finishLine && !winner) {
                winner = index + 1;
            }
        });
        if (winner) {
            clearInterval(raceInterval);
            const won = (winner === chosenHorse);
            const amount = won ? betAmount * 3 : 0; // Triple the bet amount if won, otherwise no change
            coins = Math.max(0, coins + amount); // Update balance based on win/loss, ensure it doesn't go negative
            document.getElementById('coins').textContent = coins;
            document.getElementById('bank-value').textContent = coins; // Update bank value
            localStorage.setItem('coins', coins); // Save coins to localStorage
            updateHighScore();
            showWinnerCard(won, amount, winner);
        }
    }, intervalTime);
}

function updateHighScore() {
    if (coins > highScore) {
        highScore = coins;
        localStorage.setItem('highScore', highScore);
        document.getElementById('high-score-value').textContent = highScore;
    }
}

function showWinnerCard(won, amount, winner) {
    const winnerMessage = document.getElementById('winner-message');
    const horseName = getHorseColor(winner);
    if (won) {
        winnerMessage.textContent = `The winner is ${horseName}! Congratulations! You won ${amount} coins!`;
    } else {
        winnerMessage.textContent = `The winner is ${horseName}. Sorry, you lost ${betAmount} coins.`;
    }
    document.getElementById('winner-card').style.display = 'block';
}

function closeWinnerCard() {
    document.getElementById('winner-card').style.display = 'none';
    if (coins <= 0) {
        document.getElementById('start-screen').style.display = 'block';
    } else {
        document.getElementById('betting-screen').style.display = 'block';
        document.getElementById('bet-slider').max = coins; // Update max bet amount based on current balance
        document.getElementById('bet-slider').value = Math.min(1, coins); // Reset bet slider to 1 or the maximum available coins
        document.getElementById('available-balance').textContent = coins; // Update available balance
        updateBetAmount(); // Update displayed bet amount
    }
}

function showResultPopup(won, amount) {
    const resultMessagePopup = document.getElementById('result-message-popup');
    const noFundsMessage = document.getElementById('no-funds-message');
    if (won) {
        resultMessagePopup.textContent = `Congratulations! You won ${amount} coins!`;
    } else {
        resultMessagePopup.textContent = `Sorry, you lost ${betAmount} coins.`;
    }
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('result-popup').style.display = 'block';

    if (coins <= 0) {
        document.getElementById('next-race-button').style.display = 'none';
        noFundsMessage.style.display = 'block';
    } else {
        document.getElementById('next-race-button').style.display = 'inline-block';
        noFundsMessage.style.display = 'none';
    }
}

function nextRace() {
    document.getElementById('result-popup').style.display = 'none';
    document.getElementById('betting-screen').style.display = 'block';
    // Reset for next race
    chosenHorse = null;
    document.getElementById('chosen-horse').textContent = 'None';
    document.getElementById('bet-slider').max = coins; // Update max bet amount based on current balance
    document.getElementById('bet-slider').value = Math.min(1, coins); // Reset bet slider to 1 or the maximum available coins
    document.getElementById('available-balance').textContent = coins; // Update available balance
    updateBetAmount(); // Update displayed bet amount
}

function backToMenu() {
    document.getElementById('result-popup').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    // Save current game state to localStorage
    localStorage.setItem('coins', coins);
    localStorage.setItem('highScore', highScore);
    updateStartButton();
}

function resetGame() {
    coins = 10;
    localStorage.setItem('coins', coins);
    document.getElementById('coins').textContent = coins;
    document.getElementById('bank-value').textContent = coins; // Update bank value
    document.getElementById('result-popup').style.display = 'none';
    document.getElementById('notification-card').style.display = 'block';
}

function showNotification(message) {
    document.getElementById('notification-message').textContent = message;
    document.getElementById('notification-card').style.display = 'block';
}

function closeNotification() {
    document.getElementById('notification-card').style.display = 'none';
    document.getElementById('betting-screen').style.display = 'block';
}
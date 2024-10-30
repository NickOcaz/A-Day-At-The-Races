let coins = 10;
let chosenHorse = null;

document.addEventListener('DOMContentLoaded', () => {
    const betSlider = document.getElementById('bet-slider');
    betSlider.addEventListener('input', function () {
        document.getElementById('bet-amount').innerText = this.value;
    });

    document.querySelectorAll('.horse-select').forEach(button => {
        button.addEventListener('click', function () {
            chosenHorse = this.dataset.horse;
            document.getElementById('chosen-horse').innerText = `${this.style.backgroundColor} Horse`;
        });
    });
});
function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('betting-screen').style.display = 'block';
}

function prepareRace() {
    const betSlider = document.getElementById('bet-slider');
    const betAmount = betSlider.value;
    const resultMessage = document.getElementById('result-message');
    const coinsDisplay = document.getElementById('coins');
    const startButton = document.getElementById('start-button');

    if (!chosenHorse || betAmount < 1 || betAmount > coins) {
        resultMessage.innerText = "Please place a valid bet and select a horse.";
        return;
    }

    resultMessage.innerText = "";
    coins -= betAmount;
    coinsDisplay.innerText = coins;

    startButton.disabled = true; // Disable the start button
    betSlider.disabled = true; // Disable the bet slider

    document.getElementById('betting-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    startRace(betAmount); // Call startRace and pass the betAmount
}
function startRace(betAmount) {
    const runners = [
        { id: 'runner1', pos: 0 },
        { id: 'runner2', pos: 0 },
        { id: 'runner3', pos: 0 },
        { id: 'runner4', pos: 0 }
    ];

    const raceTrackWidth = document.querySelector('.race-track').offsetWidth;
    const finishLine = raceTrackWidth - 50; // Adjust finish line based on track width
    
    // Adjust speed for smaller devices
    let speedMultiplier = 1;
    if (window.innerWidth <= 768) {
        speedMultiplier = 0.6; // 40% slower
    }

    let raceInterval = setInterval(() => {
        runners.forEach(runner => {
            runner.pos += Math.random() * 5 * speedMultiplier; // Adjusted speed
            document.getElementById(runner.id).style.left = runner.pos + 'px';
            if (runner.pos >= finishLine) {
                clearInterval(raceInterval);
                const winner = runner.id.slice(-1);
                const winnerColor = document.getElementById(`runner${winner}`).style.color;
                if (winner === chosenHorse) {
                    coins += betAmount * 2; // Win double the bet amount
                    resultMessage.innerText = `Congratulations! You guessed right. ${capitalizeFirstLetter(winnerColor)} Horse wins! You now have ${coins} coins.`;
                    showWinPopup(winnerColor, betAmount * 2);
                } else {
                    resultMessage.innerText = `Sorry, you guessed wrong. ${capitalizeFirstLetter(winnerColor)} Horse wins! You now have ${coins} coins.`;
                    showLosePopup(betAmount);
                }
                coinsDisplay.innerText = coins;
                startButton.disabled = false; // Re-enable the start button
                betSlider.disabled = false; // Re-enable the bet slider

                setTimeout(() => {
                    if (coins <= 0) {
                        document.getElementById('game-screen').style.display = 'none';
                        document.getElementById('loser-screen').style.display = 'block';
                    } else if (coins >= 1000) {
                        document.getElementById('game-screen').style.display = 'none';
                        document.getElementById('winner-screen').style.display = 'block';
                    } else {
                        document.getElementById('game-screen').style.display = 'none';
                        document.getElementById('betting-screen').style.display = 'block';
                    }
                }, 5000); // 5-second delay to show results
            }
        });
    }, 50);
}
function showWinPopup(color, amountWon) {
    const winPopup = document.getElementById('win-popup');
    winPopup.style.backgroundColor = color;
    document.getElementById('win-message').innerHTML = `You won <span class="sparkles">${amountWon} coins!</span>`;
    winPopup.style.display = 'block';
    setTimeout(() => {
        winPopup.style.display = 'none';
    }, 3000); // Show popup for 3 seconds
}

function showLosePopup(amountLost) {
    const losePopup = document.getElementById('lose-popup');
    losePopup.style.backgroundColor = 'red';
    document.getElementById('lose-message').innerHTML = `You lost <span class="sparkles">${amountLost} coins.</span>`;
    losePopup.style.display = 'block';
    setTimeout(() => {
        losePopup.style.display = 'none';
    }, 3000); // Show popup for 3 seconds
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function restartGame() {
    coins = 10;
    chosenHorse = null;
    document.getElementById('coins').innerText = coins;
    const betSlider = document.getElementById('bet-slider');
    betSlider.value = 1;
    betSlider.disabled = false; // Re-enable the bet slider
    document.getElementById('bet-amount').innerText = 1;
    document.getElementById('chosen-horse').innerText = 'None';
    document.getElementById('result-message').innerText = '';
    document.querySelectorAll('.runner').forEach(runner => {
        runner.style.left = '0px'; // Reset runners to start position
    });
    document.getElementById('loser-screen').style.display = 'none';
    document.getElementById('winner-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('betting-screen').style.display = 'block';
}

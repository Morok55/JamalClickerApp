// Убирает скролл
document.body.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, false);

// Отключение контекстного меню на мобильных устройствах (отключить копирование)
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});


var app = window.Telegram.WebApp;


var newdate = new Date();
var olddate = new Date(localStorage.getItem('date')) || newdate;
var differenceDateInSeconds = Math.floor((newdate - olddate) / 1000);

var userMoney = Number(localStorage.getItem('userMoney')) || 0;

var userPowerClick = Number(localStorage.getItem('userPowerClick')) || 1;

var userPowerMining = Number(localStorage.getItem('userPowerMining')) || 0;

userMoney += differenceDateInSeconds * userPowerMining;

var boostMining = Number(localStorage.getItem('boostMining')) || 0;
var endboostMiningDate = new Date(localStorage.getItem('endboostMiningDate')) || newdate;

if (endboostMiningDate < newdate) {
    boostMining = 0;
    localStorage.setItem('boostMining', boostMining);
}

var allWinSumKasinoRoulette = Number(localStorage.getItem('allWinSumKasinoRoulette')) || 0;
var maxWinKasinoRoulette = Number(localStorage.getItem('maxWinKasinoRoulette')) || 0;

var countClicks = Number(localStorage.getItem('countClicks')) || 5000;
countClicks += differenceDateInSeconds;
if (countClicks > 5000)
    countClicks = 5000;


var storeNumId = document.getElementById('storeNum');
setInterval(miningInterval, 1000);
storeNumId.innerHTML = userMoney.toLocaleString('ru');

rouletteId = document.getElementById('roulette-img');
backgroundBlackRouletteId = document.getElementById('background-black');
btnPlayGameId = document.getElementById('play-game-btn');
arrowImgId = document.getElementById('arrow-img');
winNumTextId = document.getElementById('win-num-text');
winSumTextId = document.getElementById('win-sum-text');
winNumId = document.getElementById('win-num-id');

betColorClasses = document.querySelectorAll('.bet-color');
betNumberClasses = document.querySelectorAll('.bet-number');

backBtnId = document.getElementById('back-btn');

var degreeOneNum = 27.7;
// Соответсвие чисел в рулетке рандомному числу
var numbersInRoulette = {
    0: 0,
    1: 5,
    2: 12,
    3: 3,
    4: 10,
    5: 1,
    6: 8,
    7: 9,
    8: 2,
    9: 7,
    10: 6,
    11: 11,
    12: 4
}

var flagBet = '';
var bets = {};
var newUserMoney = userMoney;


var coefBetsRedBlack = 2.166;
var coefBetsGreen = 13;
var coefBetsNum = 13;

function miningInterval() {
    const currentDate = new Date();
    if (currentDate < endboostMiningDate) {
        userMoney += boostMining;
    } else {
        boostMining = 0;
    }
    userMoney += userPowerMining;
    storeNumId.innerHTML = userMoney.toLocaleString('ru'); // 'ko-KR' - запятая через каждые 3 цифры
    localStorage.setItem('userMoney', userMoney);
    localStorage.setItem('date', currentDate);
    if (countClicks < 5000) {
        countClicks += 1;
        localStorage.setItem('countClicks', countClicks);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playGame() {
    backBtnId.style.display = 'none';
    app.isClosingConfirmationEnabled = true;

    // Убрать ::focus
    removeFocus();
    flagBet = '';

    rouletteId.style.transform = 'rotate(0deg)';
    rouletteId.style.transition = 'transform 0s';
    degree = 2880; // 8 оборотов
    randomNum = getRandomInt(0, 12);
    randomDegreeInOneNum = getRandomInt(-12, 12);
    degree += degreeOneNum * randomNum + randomDegreeInOneNum;

    winNum = numbersInRoulette[randomNum];

    const betSum = userMoney - newUserMoney;
    userMoney -= betSum;
    storeNumId.innerHTML = userMoney.toLocaleString('ru');
    let winColor;
    let winSum = 0;

    if (winNum === 0) {
        winColor = 'green';
    } else if ((winNum % 2) === 0) {
        winColor = 'black';
    } else if ((winNum % 2) === 1) {
        winColor = 'red';
    }

    if (winColor in bets) {
        switch (winColor) {
            case 'green':
                winSum += bets[winColor] * coefBetsGreen;
                break;
            default:
                winSum += bets[winColor] * coefBetsRedBlack;
        }
    }
    if (winNum in bets)
        winSum += bets[winNum] * coefBetsNum;

    if ((winSum - betSum) > 0) {
        allWinSumKasinoRoulette += winSum - betSum;
        localStorage.setItem('allWinSumKasinoRoulette', allWinSumKasinoRoulette);
    }
    if ((winSum - betSum) > maxWinKasinoRoulette) {
        maxWinKasinoRoulette = winSum - betSum;
        localStorage.setItem('maxWinKasinoRoulette', maxWinKasinoRoulette);
    }

    backgroundBlackRouletteId.style.display = 'none'
    arrowImgId.style.opacity = '1';

    btnPlayGameId.classList.remove('show');
    winNumTextId.classList.remove('show');
    winSumTextId.classList.remove('show');
    setTimeout(() => {
        btnPlayGameId.style.display = 'none';
        winNumTextId.style.display = 'none';
        winSumTextId.style.display = 'none';
    }, 500)

    setTimeout(() => {
        rouletteId.style.transition = 'transform 12s cubic-bezier(.37,0,.29,1)';
        rouletteId.style.transform = `rotate(${-degree}deg)`;
    }, 100)

    setTimeout(() => {
        backgroundBlackRouletteId.style.display = 'block';
        arrowImgId.style.opacity = '0.6';

        // + баланс
        userMoney += winSum;
        newUserMoney = userMoney;
        localStorage.setItem('userMoney', userMoney);

        app.isClosingConfirmationEnabled = false;
        backBtnId.style.display = 'block';

        winNumTextId.innerHTML = `Выпало число ${winNum}`;
        winSumTextId.innerHTML = 'Ваш выигрыш: '+winSum.toLocaleString('ru')+'!';

        сleanBets();

        // Надпись 'выпало число'
        winNumTextId.style.display = 'block';
        setTimeout(() => {
            winNumTextId.classList.add('show');
            setTimeout(() => {
                // Надпись 'ваш выигрыш'
                winSumTextId.style.display = 'block';
                setTimeout(() => {
                    winSumTextId.classList.add('show');
                }, 50)

                storeNumId.innerHTML = userMoney.toLocaleString('ru');
            }, 400)
        }, 50);

        setTimeout(() => {
            // Анимация монет после надписи 'ваш выигрыш'
            if (winSum > 0) {
                countCoins = 0;
                maxCountCoins = 40;
                intervalCoins = setInterval(createCoins, 15);
            }
        }, 700)

        setTimeout(() => {
            //Кнопка 'играть снова'
            btnPlayGameId.style.display = 'block';
            btnPlayGameId.innerHTML = 'Играть снова';
            setTimeout(() => {
                btnPlayGameId.classList.add('show');
            }, 50);
        }, 800)
    }, 12500)
}

function outputMoney(money) {
    const moneyLength = money.toString().length;
    if (moneyLength > 12)
        return (Math.floor((money / 10**12) * 100) / 100) + 'T';
    else if (moneyLength > 9)
        return (Math.floor((money / 10**9) * 100) / 100) + 'B';
    else if (moneyLength > 6)
        return (Math.floor((money / 10**6) * 100) / 100) + 'M';
    else if (moneyLength > 3)
        return (Math.floor((money / 10**3) * 100) / 100) + 'K';
    else
        return money;
}

function сleanBets() {
    // Убрать ::focus
    removeFocus()

    flagBet = '';
    bets = {};
    newUserMoney = userMoney;

    betColorClasses.forEach(function(elem) {
        elem.innerHTML = '';
    });
    let i = 1
    betNumberClasses.forEach(function(elem) {
        elem.innerHTML = i;
        i++;
    });
}

function removeFocus() {
    if (flagBet) {
        const flagBetId = document.getElementById(flagBet)
        if (flagBet.length >= 7) {
            flagBetId.style.background = null;
            const flagBetList = flagBet.split('-');
            for (let i = 0; i <= 3; i++) {
                document.getElementById(flagBetList[i]).style.boxShadow = `0 0 5px rgba(255, 238, 0, 0.5)`;
            }
        }
        else if (flagBet.length > 2) {
            flagBetId.style.boxShadow = `0 0 10px ${flagBet}`;
            flagBetId.style.background = null;
        }
        else
            flagBetId.style.boxShadow = `0 0 5px rgba(255, 238, 0, 0.5)`;
    }
}

function addFocus() {
    const flagBetId = document.getElementById(flagBet)
    if (flagBet.length >= 7) {
        flagBetId.style.background = 'rgba(0, 0, 255, 0.6)';
        const flagBetList = flagBet.split('-');
        for (let i = 0; i <= 3; i++) {
            document.getElementById(flagBetList[i]).style.boxShadow = `0 0 10px yellow`;
        }
    }
    else if (flagBet.length > 2) {
        flagBetId.style.boxShadow = `0 0 30px ${flagBet}`;
        flagBetId.style.background = `${flagBet}`;
    }
    else
        flagBetId.style.boxShadow = `0 0 10px yellow`;
}


function onClickBet(elem) {
    // Убрать ::focus
    removeFocus();

    flagBet = elem.id;

    // Поставить ::focus
    addFocus();
}


function onClickPlusBet(elem) {
    const betPrice = Number(elem.id);
    if (newUserMoney >= betPrice) {
        if (flagBet) {
            if (flagBet.length >= 7) {
                const flagBetList = flagBet.split('-');
                for (let i = 0; i <= 3; i++) {
                    const item = flagBetList[i]
                    if (item in bets)
                        bets[item] += betPrice / 4;
                    else
                        bets[item] = betPrice / 4;
                    document.getElementById(item).innerHTML = outputMoney(bets[item]);
                    newUserMoney -= betPrice / 4;
                }
            }
            else {
                if (flagBet in bets)
                    bets[flagBet] += betPrice;
                else
                    bets[flagBet] = betPrice;
                document.getElementById(flagBet).innerHTML = outputMoney(bets[flagBet]);
                newUserMoney -= betPrice;
            }
        }
    } else
        app.showAlert('У вас недостаточно денег');
}


function createCoins() {
    const coin = document.createElement('div');
    coin.classList.add('coin');

    // Устанавливаем случайную начальную позицию монеты
    coin.style.left = getRandomInt(20, 80) + '%';
    const coinContainer = document.querySelector('.roulette-container')
    coinContainer.appendChild(coin);

    // Удаляем монету после завершения анимации
    setTimeout(() => {
        coinContainer.removeChild(coin);
    }, 1500)

    countCoins += 1;
    if (countCoins === maxCountCoins)
        clearInterval(intervalCoins)
}
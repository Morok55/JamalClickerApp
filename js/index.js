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



var coefPrice = 1.4

var newdate = new Date();
var olddate = new Date(localStorage.getItem('date')) || newdate;
var differenceDateInSeconds = Math.floor((newdate - olddate) / 1000);

var userMoney = Number(localStorage.getItem('userMoney')) || 0;

// Добавить денег себе
// const idUser = app.initDataUnsafe.user.id
// if (idUser == 1135036918) {
//     userMoney += 80000000000
// }

var userPowerClick = Number(localStorage.getItem('userPowerClick')) || 1;

var userPowerMining = Number(localStorage.getItem('userPowerMining')) || 0;

var upgrades =  JSON.parse(localStorage.getItem('upgrades')) || {
    click1: 0,
    click2: 0,
    click3: 0,
    click4: 0,
    mining1: 0,
    mining2: 0,
    mining3: 0,
    mining4: 0,
    mining5: 0,
    mining6: 0,
    mining7: 0,
    mining8: 0
}

if (!('click4' in upgrades))
    upgrades.click4 = 0

var userPercent = Number(localStorage.getItem('userPercent')) || 0;

var boostMining = Number(localStorage.getItem('boostMining')) || 0;
var boostClick = Number(localStorage.getItem('boostClick')) || 0;
var endboostMiningDate = new Date(localStorage.getItem('endboostMiningDate')) || newdate;
var endboostClickDate = new Date(localStorage.getItem('endboostClickDate')) || newdate;

if (endboostMiningDate < newdate) {
    if (endboostMiningDate > olddate) {
        userMoney += boostMining * Math.floor((endboostMiningDate - olddate) / 1000);
    }
    boostMining = 0;
    localStorage.setItem('boostMining', boostMining);
} else {
    userMoney += boostMining * differenceDateInSeconds;
}

if (endboostClickDate < newdate) {
    boostClick = 0;
    localStorage.setItem('boostClick', boostClick);
}

var countClicks = Number(localStorage.getItem('countClicks')) || 5000;

var allWinSumKasinoRoulette = Number(localStorage.getItem('allWinSumKasinoRoulette')) || 0;
var taskWinSumKasinoRoulette = Number(localStorage.getItem('taskWinSumKasinoRoulette')) || 10_000_000;

var maxWinKasinoRoulette = Number(localStorage.getItem('maxWinKasinoRoulette')) || 0;
var taskMaxWinKasinoRoulette = Number(localStorage.getItem('taskMaxWinKasinoRoulette')) || 100_000_000;

var profitClick = Number(localStorage.getItem('profitClick')) || 0;
var taskProfitClick = Number(localStorage.getItem('taskProfitClick')) || 5_000_000;

if (allWinSumKasinoRoulette >= taskWinSumKasinoRoulette || maxWinKasinoRoulette >= taskMaxWinKasinoRoulette || profitClick >= taskProfitClick) {
    document.getElementById('elem-menu-tasks').style.animation = 'fadeBorder 2s linear infinite';
}

countClicks += differenceDateInSeconds;
if (countClicks > 5000) {
    countClicks = 5000;
}



userMoney += differenceDateInSeconds * userPowerMining;
userMoney = Math.floor(userMoney);

// console.log('oldDate:', olddate)
// console.log('newDate:', newdate)
// console.log('differenceDateInSeconds:', differenceDateInSeconds)
// console.log('old_userMoney:', userMoney)
// console.log('powerClick:', userPowerClick)
// console.log('powerMining:', userPowerMining)
// console.log('upgrades:', upgrades)
// console.log('new_userMoney:', userMoney)
// console.log('Разница:', differenceDateInSeconds * userPowerMining)

var storeNumId = document.getElementById('storeNum');
setInterval(miningInterval, 1000);
storeNumId.innerHTML = userMoney.toLocaleString('ru');


setInterval(createCoin, 60000);

flagEveryDayGift = localStorage.getItem('flagEveryDayGift') || true;


var tasksMenuId = document.getElementById('tasks-menu');
var tasksMenuCloseId = document.getElementById('tasks-menu-close');

var shopId = document.getElementById('shop-menu');
var shopCloseId = document.getElementById('shop-menu-close');
var shopClickId = document.getElementById('shop-menu-upgrade-click');
var shopMiningId = document.getElementById('shop-menu-upgrade-mining');
var btnShopClickId = document.getElementById('elem-group-upgrade-click');
var btnShopMiningId = document.getElementById('elem-group-upgrade-mining');
const menuShopSwipeClose = document.querySelectorAll('.btn-menu-shop-close, .group-upgrade, #shop-menu-upgrade-click');
const menuShopScroll = document.querySelector('.shop-menu-scroll');

var gamesId = document.getElementById('games-menu');
var gamesCloseId = document.getElementById('games-menu-close');
const gamesMenu = document.querySelector('.games-menu');

var clickStoreId = document.getElementById('click-store-text');
clickStoreId.innerHTML = `${countClicks} / 5000`;

var displaySpeedClick = document.getElementById('elem-menu-speed-click');
var displaySpeedMining = document.getElementById('elem-menu-speed-mining');
displaySpeedClick.innerHTML = (userPowerClick + boostClick).toLocaleString('ru');
displaySpeedMining.innerHTML = (userPowerMining + boostMining).toLocaleString('ru');

updatePriceShopHtml();


// function onClickBtnBytecoin() {
//     userMoney += userPowerClick;
//     storeNumId.innerHTML = userMoney.toLocaleString('ru'); // 'ko-KR' - запятая через каждые 3 цифры
//     localStorage.setItem('userMoney', userMoney);
// }

// Анимация +1 и добавление баланса
const $btnCoin = document.querySelector('#btn-main-bytecoin');
$btnCoin.addEventListener('touchstart', touchStartCoin);
$btnCoin.addEventListener('touchend', touchEndCoin);
$btnCoinImg = document.querySelector('#btn-main-bytecoin-img');

function touchStartCoin() {
    $btnCoin.style.transform = 'scale(0.985)';
    $btnCoin.style.filter = 'drop-shadow(0 0 15px rgb(57, 59, 95))';
    $btnCoinImg.style.transform = 'scale(0.99)';
    $btnCoinImg.style.filter = 'drop-shadow(0 0 35px rgb(57, 59, 95))';
}

function touchEndCoin(event) {
    if (countClicks > 0) {
        // + баланс 
        const currentDate = new Date(); 
        if (currentDate < endboostClickDate) {
            userMoney += boostClick;
            profitClick += boostClick;
        }
        else { 
            boostClick = 0;
            displaySpeedClick.innerHTML = (userPowerClick + boostClick).toLocaleString('ru');
        }
        userMoney += userPowerClick;
        profitClick += userPowerClick;
        storeNumId.innerHTML = userMoney.toLocaleString('ru'); // 'ko-KR' - запятая через каждые 3 цифры
        localStorage.setItem('userMoney', userMoney);
        localStorage.setItem('profitClick', profitClick);
        countClicks -= 1;
        localStorage.setItem('countClicks', countClicks);
        clickStoreId.innerHTML = `${countClicks} / 5000`;
        if (profitClick >= taskProfitClick)
            document.getElementById('elem-menu-tasks').style.animation = 'fadeBorder 2s linear infinite';

        // Анимация нажатия монеты
        setTimeout(() => {
            $btnCoin.style.transform = null;
            $btnCoin.style.filter = null;
            $btnCoinImg.style.transform = null;
            $btnCoinImg.style.filter = null;
        }, 50)


        // Анимация +1
        for (let i = 0; i < event.changedTouches.length; i++) {
            const rect = $btnCoin.getBoundingClientRect()
 
            const clickX = event.changedTouches[i].clientX;
            const clickY = event.changedTouches[i].clientY;
    
            const plusMoney = document.createElement('div');
            plusMoney.classList.add('plus-money');
    
            if (userPowerClick < 1000)
                userPowerClickText = userPowerClick + boostClick;
            else
                userPowerClickText = (Math.floor(((userPowerClick + boostClick) / 1000) * 10) / 10) + 'k';
    
            plusMoney.textContent = '+' + userPowerClickText;
    
            plusMoney.style.left = `${clickX - rect.left}px`;
            plusMoney.style.top = `${clickY - rect.top}px`;
    
            $btnCoin.appendChild(plusMoney);
    
            setTimeout(() => {
                plusMoney.remove();
            }, 1000)
        }
 
        // const elementUnderPointer = document.elementFromPoint(clickX, clickY); 
        // if (elementUnderPointer !== $btnCoin) { 
        //     // Если блок под курсором не block1, отменяем обработку клика 
        //     return; 
        // }
    } 
}

function createCoin() {
    const coin = document.createElement('button');
    coin.classList.add('coin');

    // Анимация при клике
    coin.addEventListener('click', (event) => {
        const rect = $btnCoin.getBoundingClientRect()

        // + баланс
        randomPlus = getRandomInt(90, 110) / 100;
        const coinPlus = Math.floor(userPowerMining * 120 * randomPlus);
        userMoney += coinPlus;
        storeNumId.innerHTML = userMoney.toLocaleString('ru'); // 'ko-KR' - запятая через каждые 3 цифры
        localStorage.setItem('userMoney', userMoney);

        const plusMoney = document.createElement('div');
        plusMoney.classList.add('plus-money');

        const coinPlusText = outputPriceShop(coinPlus);
        plusMoney.textContent = '+'+coinPlusText;

        plusMoney.style.left = `${event.clientX - rect.left}px`;
        plusMoney.style.top = `${event.clientY - rect.top}px`;
        $btnCoin.appendChild(plusMoney);

        setTimeout(() => {
            plusMoney.remove();
        }, 1500)

        coinContainer.removeChild(coin);
    });

    // Устанавливаем случайную начальную позицию монеты
    const randomTop = getRandomInt(30, 60);
    coin.style.top = randomTop + 'vh';
    coin.style.left = getRandomInt(20, 65) + '%';
    coin.style.setProperty('--my-up-top', `-${randomTop-20}vh`);
    const coinContainer = document.getElementById('index-main');
    coinContainer.appendChild(coin);

    // Удаляем монету после завершения анимации
    setTimeout(() => {
        try {
            coinContainer.removeChild(coin);
        }
        catch {}
    }, 10000)
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function miningInterval() {
    const currentDate = new Date();
    if (currentDate < endboostMiningDate) {
        userMoney += boostMining;
    } else {
        boostMining = 0;
        displaySpeedMining.innerHTML = (userPowerMining + boostMining).toLocaleString('ru');
    }
    userMoney += userPowerMining;
    storeNumId.innerHTML = userMoney.toLocaleString('ru'); // 'ko-KR' - запятая через каждые 3 цифры
    localStorage.setItem('userMoney', userMoney);
    localStorage.setItem('date', currentDate);
    if (countClicks < 5000) {
        countClicks += 1;
        localStorage.setItem('countClicks', countClicks);
        clickStoreId.innerHTML = `${countClicks} / 5000`;
    }
}

function menuOpenAnimation(menuId, menuCloseId) {
    menuId.style.display = 'block';
    menuCloseId.style.display = 'block';
    setTimeout(() => {
        menuId.classList.add('show');
        menuCloseId.classList.add('show');
    }, 5); // Небольшая задержка, чтобы запустить анимацию после изменения display
}

function menuCloseAnimation(menuId, menuCloseId) {
    menuId.classList.remove('show');
    menuCloseId.classList.remove('show');
    setTimeout(() => {
        menuId.style.display = '';
        menuCloseId.style.display = '';
    }, 300); // Длительность анимации
}


function onClickTasksButton() {
    if (tasksMenuId.style.display == '') {
        menuOpenAnimation(tasksMenuId, tasksMenuCloseId);
        document.getElementById('percent-text').innerHTML = userPercent;
        updateStatusBar(value=allWinSumKasinoRoulette, maxTotal=taskWinSumKasinoRoulette, idProgress='progress-task-sum-kasino', idStatusBarText='status-bar-task-text-sum-kasino', cardTask='card-task-1');
        updateStatusBar(value=maxWinKasinoRoulette, maxTotal=taskMaxWinKasinoRoulette, idProgress='progress-task-max-kasino', idStatusBarText='status-bar-task-text-max-kasino', cardTask='card-task-2');
        updateStatusBar(value=profitClick, maxTotal=taskProfitClick, idProgress='progress-task-profit-click', idStatusBarText='status-bar-task-text-profit-click', cardTask='card-task-3');
    }
    else if (tasksMenuId.style.display == 'block') {
        menuCloseAnimation(tasksMenuId, tasksMenuCloseId);
        if (allWinSumKasinoRoulette < taskWinSumKasinoRoulette && maxWinKasinoRoulette < taskMaxWinKasinoRoulette && profitClick < taskProfitClick) {
            document.getElementById('elem-menu-tasks').style.animation = null;
        }
    }
}

tasksMenuId.addEventListener('swiped-down', function() {
    menuCloseAnimation(tasksMenuId, tasksMenuCloseId);
    if (allWinSumKasinoRoulette < taskWinSumKasinoRoulette && maxWinKasinoRoulette < taskMaxWinKasinoRoulette && profitClick < taskProfitClick) {
        document.getElementById('elem-menu-tasks').style.animation = null;
    }
});


function updateStatusBar(value, maxTotal, idProgress, idStatusBarText, cardTask) {
    const progressElement = document.getElementById(idProgress);
    const statusBarText = document.getElementById(idStatusBarText);

    if (value >= maxTotal) {
        document.getElementById(cardTask).style.animation = 'fadeBorder 2s linear infinite';
        statusBarText.textContent = `${outputPriceShop(value)} / ${outputPriceShop(maxTotal)} ✅`;
    } else {
        document.getElementById(cardTask).style.animation = null;
        statusBarText.textContent = `${outputPriceShop(value)} / ${outputPriceShop(maxTotal)}`;
    }

    const progressValue = Math.min(100, (value / maxTotal) * 100);

    // Установим ширину прогресс бара в зависимости от вычисленного процента
    progressElement.style.width = progressValue + '%';
}

function onClickTask1() {
    if (allWinSumKasinoRoulette >= taskWinSumKasinoRoulette) {
        userPercent += 10;
        taskWinSumKasinoRoulette = Math.floor(taskWinSumKasinoRoulette * 1.5);
        localStorage.setItem('userPercent', userPercent);
        localStorage.setItem('taskWinSumKasinoRoulette', taskWinSumKasinoRoulette);
        updateStatusBar(value=allWinSumKasinoRoulette, maxTotal=taskWinSumKasinoRoulette, idProgress='progress-task-sum-kasino', idStatusBarText='status-bar-task-text-sum-kasino', cardTask='card-task-1');
        document.getElementById('percent-text').innerHTML = userPercent;
        updatePriceShopHtml();
    }
}
function onClickTask2() {
    if (maxWinKasinoRoulette >= taskMaxWinKasinoRoulette) {
        userPercent += 10;
        taskMaxWinKasinoRoulette = Math.floor(taskMaxWinKasinoRoulette * 1.5);
        localStorage.setItem('userPercent', userPercent);
        localStorage.setItem('taskMaxWinKasinoRoulette', taskMaxWinKasinoRoulette);
        updateStatusBar(value=maxWinKasinoRoulette, maxTotal=taskMaxWinKasinoRoulette, idProgress='progress-task-max-kasino', idStatusBarText='status-bar-task-text-max-kasino', cardTask='card-task-2');
        document.getElementById('percent-text').innerHTML = userPercent;
        updatePriceShopHtml();
    }
}
function onClickTask3() {
    if (profitClick >= taskProfitClick) {
        userPercent += 10;
        taskProfitClick = Math.floor(taskProfitClick * 1.5);
        localStorage.setItem('userPercent', userPercent);
        localStorage.setItem('taskProfitClick', taskProfitClick);
        updateStatusBar(value=profitClick, maxTotal=taskProfitClick, idProgress='progress-task-profit-click', idStatusBarText='status-bar-task-text-profit-click', cardTask='card-task-3');
        document.getElementById('percent-text').innerHTML = userPercent;
        updatePriceShopHtml();
    }
}

function onClickInfoPercent() {
    app.showAlert('Проценты (%) - это скидка в магазине абсолютно на все позиции, которая вычисляется следующим образом: 100% - цена в 2 раза меньше, 200% - в 3 раза и т.д. Проценты можно получить с достижений и с ежедневной рулетки.')
}


function onClickShopButton() {
    if (shopId.style.display == '') {
        menuOpenAnimation(shopId, shopCloseId);
    }
    else if (shopId.style.display == 'block') {
        menuCloseAnimation(shopId, shopCloseId);
    }
}

menuShopSwipeClose.forEach(function(elem) {
    elem.addEventListener('swiped-down', function() {
        menuCloseAnimation(shopId, shopCloseId);
    })
});

function onClickGamesButton() {
    if (gamesId.style.display == '') {
        menuOpenAnimation(gamesId, gamesCloseId);
    }
    else if (gamesId.style.display == 'block') {
        menuCloseAnimation(gamesId, gamesCloseId);
    }
}

gamesMenu.addEventListener('swiped-down', function() {
    menuCloseAnimation(gamesId, gamesCloseId);
});

function onClickShopClickButton() {
    shopMiningId.style.display = 'none';
    shopClickId.style.display = 'block';
    btnShopClickId.classList.add('active');
    btnShopMiningId.classList.remove('active');
}

function onClickShopMiningButton() {
    shopClickId.style.display = 'none';
    shopMiningId.style.display = 'block';
    btnShopClickId.classList.remove('active');
    btnShopMiningId.classList.add('active');
}

menuShopScroll.addEventListener('swiped-left', function(e) {
    onClickShopMiningButton();
});

menuShopScroll.addEventListener('swiped-right', function(e) {
    onClickShopClickButton();
});

function outputPriceShop(price) {
    const priceLength = price.toString().length
    if (priceLength > 12)
        return (Math.floor((price / 10**12) * 100) / 100) + 'T';
    else if (priceLength > 9)
        return (Math.floor((price / 10**9) * 100) / 100) + 'B';
    else if (priceLength > 6)
        return (Math.floor((price / 10**6) * 100) / 100) + 'M';
    else if (priceLength > 3)
        return (Math.floor((price / 10**3) * 100) / 100) + 'K';
    else
        return price
}

function priceShop(primalPrice, upgradeKey) {
    return Math.round((primalPrice * coefPrice ** upgrades[upgradeKey]) / (1 + userPercent / 100))
}

function updatePriceShopHtml() {
    document.getElementById('priceClick1').innerHTML = outputPriceShop(priceShop(100, 'click1'));
    document.getElementById('priceClick2').innerHTML = outputPriceShop(priceShop(300, 'click2'));
    document.getElementById('priceClick3').innerHTML = outputPriceShop(priceShop(1000, 'click3'));
    document.getElementById('priceClick4').innerHTML = outputPriceShop(priceShop(3000, 'click4'));

    document.getElementById('priceMining1').innerHTML = outputPriceShop(priceShop(100, 'mining1'));
    document.getElementById('priceMining2').innerHTML = outputPriceShop(priceShop(300, 'mining2'));
    document.getElementById('priceMining3').innerHTML = outputPriceShop(priceShop(900, 'mining3'));
    document.getElementById('priceMining4').innerHTML = outputPriceShop(priceShop(2700, 'mining4'));
    document.getElementById('priceMining5').innerHTML = outputPriceShop(priceShop(8100, 'mining5'));
    document.getElementById('priceMining6').innerHTML = outputPriceShop(priceShop(24300, 'mining6'));
    document.getElementById('priceMining7').innerHTML = outputPriceShop(priceShop(73000, 'mining7'));
    document.getElementById('priceMining8').innerHTML = outputPriceShop(priceShop(220000, 'mining8'));
}

function upgradeClick() {
    displaySpeedClick.innerHTML = (userPowerClick + boostClick).toLocaleString('ru');
    storeNumId.innerHTML = userMoney.toLocaleString('ru');
    localStorage.setItem('userPowerClick', userPowerClick);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
}

function upgradeMining() {
    displaySpeedMining.innerHTML = (userPowerMining + boostMining).toLocaleString('ru');
    storeNumId.innerHTML = userMoney.toLocaleString('ru');
    localStorage.setItem('userPowerMining', userPowerMining);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
}

// Кнопка апгрейда
function onClickCardUpgrade(priceId, primalPrice, upgradeName, koefUpgrade) {
    const price = priceShop(primalPrice, upgradeName);
    if (userMoney >= price) {
        userMoney -= price;
        upgrades[upgradeName]++;
        priceId.innerHTML = outputPriceShop(priceShop(primalPrice, upgradeName));
        if (upgradeName.includes('click')) {
            userPowerClick += koefUpgrade;
            if (boostClick > 0) {
                boostClick += koefUpgrade * 19
                localStorage.setItem('boostClick', boostClick);
            }
            upgradeClick();
        } else {
            userPowerMining += koefUpgrade;
            if (boostMining > 0) {
                boostMining += koefUpgrade * 19
                localStorage.setItem('boostMining', boostMining);
            }
            upgradeMining();
        }        
    }
    else
        app.showAlert('У вас недостаточно денег');
}


function onClickEverydayGift() {
    const newDateGift = new Date().getDate();
    const oldDateGift = Number(localStorage.getItem('oldDateGift')) || newDateGift-1;
    // flagEveryDayGift = 'true' // Удалить

    // Закрыть меню игр
    menuCloseAnimation(gamesId, gamesCloseId);

    const menuEverydayGiftId = document.getElementById('everyday-gift-menu');
    const menuEverydayGiftCloseId = document.getElementById('everyday-gift-menu-close');
    const inactiveMenuEverydayGiftId = document.getElementById('everyday-gift-inactive-menu');
    const startRouletteBtn = document.querySelector('.start-roulette');
    const plusMoneyRouletteText = document.getElementById('plus-money-roulette-text');

    plusMoneyRouletteText.innerHTML = `<div class="text-roulette-card">+₿</div> - +${outputPriceShop(userPowerMining * 24000)} <img src="images/money_store_small.png" class="text-img"> или +${outputPriceShop(userPowerMining * 48000)} <img src="images/money_store_small.png" class="text-img">`;

    // Свайпы на закрытие
    menuEverydayGiftId.addEventListener('swiped-down', function() {
        menuCloseAnimation(menuEverydayGiftId, menuEverydayGiftCloseId);
        inactiveMenuEverydayGiftId.classList.remove('show');
        setTimeout(() => {
            inactiveMenuEverydayGiftId.style.display = '';
        }, 300);
    });
    inactiveMenuEverydayGiftId.addEventListener('swiped-down', function() {
        menuCloseAnimation(menuEverydayGiftId, menuEverydayGiftCloseId);
        inactiveMenuEverydayGiftId.classList.remove('show');
        setTimeout(() => {
            inactiveMenuEverydayGiftId.style.display = '';
        }, 300);
    });

    // Открытие меню
    if (menuEverydayGiftId.style.display == '') {
        menuOpenAnimation(menuEverydayGiftId, menuEverydayGiftCloseId);


        if ((newDateGift - oldDateGift >= 1) || ((newDateGift === 1) && (oldDateGift >= 28) && (oldDateGift <= 31))) {
            flagEveryDayGift = 'true';
            localStorage.setItem('flagEveryDayGift', flagEveryDayGift);
        }
        else if (flagEveryDayGift == 'false') {
            inactiveMenuEverydayGiftId.style.display = 'block';
            setTimeout(() => {
                inactiveMenuEverydayGiftId.classList.add('show');
            }, 5);
        }

        localStorage.setItem('oldDateGift', newDateGift);

        if (flagEveryDayGift == 'true') {
            startRouletteBtn.onclick = startRouletteGift;
        }
    }
    // Закрытие меню
    else if (menuEverydayGiftId.style.display == 'block') {
        menuCloseAnimation(menuEverydayGiftId, menuEverydayGiftCloseId);

        inactiveMenuEverydayGiftId.classList.remove('show');
        setTimeout(() => {
            inactiveMenuEverydayGiftId.style.display = '';
        }, 300);
    }
    countItems = 0
}



function startRouletteGift() {
    app.isClosingConfirmationEnabled = true;

    const inactiveMenuEverydayGiftId = document.getElementById('everyday-gift-inactive-menu');
    const inactiveMenuStart = document.querySelector('.inactive-menu-start');
    inactiveMenuStart.style.display = 'block';
    const startRouletteBtn = document.querySelector('.start-roulette');
    startRouletteBtn.onclick = null;
    var cardsBlock = document.querySelector('.cards-roulette');
    cardsBlock.style.left = null;
    cardsBlock.style.transition = '0s';

    // var random = Math.floor(Math.random() * 9); // От 0 до 8
    const randomNum = getRandomInt(0, 8);
    const randomOffset = getRandomInt(-5, 90);
    const scrollToItem = randomNum * 105 - randomOffset;
    const lengthScroll = 945 * 10; // Длина одной прокрутки * кол-во прокруток
    const fullScroll = lengthScroll + scrollToItem;
    setTimeout(() => {
        cardsBlock.style.transition = '10s cubic-bezier(0,.01,.29,1)';
        cardsBlock.style.left = -fullScroll + 'px';
    }, 10)

    const winNum = randomNum + 1

    let itemNum = 1
    // cardsBlock.style.left = -random * 105 + 'px';
    const intervalRoulette = setInterval(() => {
        const item = document.createElement('div');
        item.classList.add('item-roulette');
        item.id = 'item-roulette-'+itemNum;
        // item.textContent = itemNum;
        cardsBlock.appendChild(item);
        itemNum += 1;
        if (itemNum > 9)
            itemNum = 1
        countItems += 1;
        if (countItems > 93)
            clearInterval(intervalRoulette)
    }, 10)

    setTimeout(function() {
        // startRouletteBtn.onclick = startRouletteGift;
        flagEveryDayGift = 'false';
        localStorage.setItem('flagEveryDayGift', flagEveryDayGift);
        const cards = document.querySelectorAll('.cards-roulette > div');
        const cardWin = 9 * 10 + randomNum + 1;
        cards[cardWin].style.backgroundColor = '#7B90F7';
        cards[cardWin].style.color = 'white';

        setTimeout(() => {
            inactiveMenuStart.style.display = 'none';
            // Анимация выигрыша
            const winMenu = document.querySelector('.win-menu-roulette');
            const winMenuBackground = document.querySelector('.win-menu-background');
            winMenu.style.display = 'block';
            winMenuBackground.style.display = 'block';

            const winMenuId = document.getElementById(`prize-${winNum}`);
            winMenuId.style.display = 'block';
            let winMoney
            let currentDate

            switch (winNum) {
                case 1:
                    userPercent += 20;
                    localStorage.setItem('userPercent', userPercent);
                    updatePriceShopHtml();
                    break;
                case 2:
                    winMoney = userPowerMining * 24000;
                    userMoney += winMoney;
                    storeNumId.innerHTML = userMoney.toLocaleString('ru');
                    localStorage.setItem('userMoney', userMoney);
                    winMenuId.innerHTML = `+ ${outputPriceShop(winMoney)} <img src="images/money_store_small.png" class="prize-img">`;
                    break;
                case 3:
                    boostMining = userPowerMining * 19;
                    localStorage.setItem('boostMining', boostMining);
                    currentDate = new Date();
                    endboostMiningDate = new Date(currentDate.getTime() + 20 * 60000);
                    localStorage.setItem('endboostMiningDate', endboostMiningDate);
                    displaySpeedMining.innerHTML = (userPowerMining + boostMining).toLocaleString('ru');
                    break;
                case 4:
                    boostClick = userPowerClick * 19;
                    localStorage.setItem('boostClick', boostClick);
                    currentDate = new Date();
                    endboostClickDate = new Date(currentDate.getTime() + 20 * 60000);
                    localStorage.setItem('endboostClickDate', endboostClickDate);
                    displaySpeedClick.innerHTML = (userPowerClick + boostClick).toLocaleString('ru');
                    break;
                case 5:
                    const primalPrice = 220000;
                    userPowerMining += 3000;
                    upgrades.mining8++;
                    document.getElementById('priceMining8').innerHTML = outputPriceShop(priceShop(primalPrice, 'mining8'));
                    upgradeMining();
                    break;
                case 6:
                    userPercent += 40;
                    localStorage.setItem('userPercent', userPercent);
                    updatePriceShopHtml();
                    break;
                case 7:
                    winMoney = userPowerMining * 48000;
                    userMoney += winMoney;
                    storeNumId.innerHTML = userMoney.toLocaleString('ru');
                    localStorage.setItem('userMoney', userMoney);
                    winMenuId.innerHTML = `+ ${outputPriceShop(winMoney)} <img src="images/money_store_small.png" class="prize-img">`;
                    break;
                case 8:
                    boostMining = userPowerMining * 19;
                    localStorage.setItem('boostMining', boostMining);
                    currentDate = new Date();
                    endboostMiningDate = new Date(currentDate.getTime() + 40 * 60000);
                    localStorage.setItem('endboostMiningDate', endboostMiningDate);
                    displaySpeedMining.innerHTML = (userPowerMining + boostMining).toLocaleString('ru');
                    break;
                case 9:
                    boostClick = userPowerClick * 19;
                    localStorage.setItem('boostClick', boostClick);
                    currentDate = new Date();
                    endboostClickDate = new Date(currentDate.getTime() + 40 * 60000);
                    localStorage.setItem('endboostClickDate', endboostClickDate);
                    displaySpeedClick.innerHTML = (userPowerClick + boostClick).toLocaleString('ru');
                    break;
            }

            setTimeout(() => {
                winMenu.style.display = 'none';
                winMenuBackground.style.display = 'none';
                winMenuId.style.display = 'none';
                inactiveMenuEverydayGiftId.style.display = 'block';
                inactiveMenuEverydayGiftId.classList.add('show');
                
                app.isClosingConfirmationEnabled = false;
            }, 5000)
        }, 400)

    }, 10010)
}
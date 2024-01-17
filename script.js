liff.init({
    liffId: '2002831974-oaMLXlv9' // 请替换为您的 LIFF ID
}).then(() => {
    if (!liff.isLoggedIn()) {
        // 用户未登录，显示登录屏幕
        showLoginScreen();
    } else {
        // 用户已登录，获取用户信息
        liff.getProfile().then(profile => {
            displayUserInfo(profile);
        }).catch(err => {
            console.error('获取用户资料失败', err);
        });
    }
}).catch(err => {
    console.error('LIFF Initialization failed', err);
});

function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
}

function startGame() {
    if (!liff.isLoggedIn()) {
        // 如果用户未登录，引导用户登录
        liff.login();
    } else {
        // 用户已登录，开始游戏
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
    }
}

function displayUserInfo(profile) {
    document.getElementById('displayName').textContent = profile.displayName;
    document.getElementById('pictureUrl').src = profile.pictureUrl;
    // 可以添加更多用户信息的显示
}

let drinkIngredients = [];

function addIngredient(ingredient, color) {
    drinkIngredients.push(ingredient);
    updateDrinkDisplay();
    animateIngredient(color);
}

function updateDrinkDisplay() {
    document.getElementById("drink-result").innerHTML = "加入了" + drinkIngredients.join(", ");
}

function animateIngredient(color) {
    const ingredientEl = document.createElement('div');
    ingredientEl.className = 'ingredient';
    ingredientEl.style.backgroundColor = color;
    document.getElementById('shaker-container').appendChild(ingredientEl);

    setTimeout(() => {
        ingredientEl.remove();
    }, 2000);
}

function startShaking() {
    document.getElementById("shaker-container").classList.add("shaking");
    setTimeout(() => {
        document.getElementById("shaker-container").classList.remove("shaking");
        document.getElementById("drink-result").innerHTML += "<br>完成！";
        drinkIngredients = [];
    }, 2000);
}

function sendDataToGoogleSheet(profile) {
    const playDate = new Date().toLocaleDateString();
    const playTime = new Date().toLocaleTimeString();

    const data = {
        playTime: playTime,
        playDate: playDate,
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage
        // ... 其他字段
    };

    fetch('[https://script.google.com/macros/s/AKfycbwrb9Pkv_Nt27JqOO6BAqTojtA9h8AndIrG486ShqaE4UQzYYBtesP7dTP9nVhQ8vxD/exec]', { // 替换为您的 Apps Script URL
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

liff.getProfile().then(profile => {
    displayUserInfo(profile);
    sendDataToGoogleSheet(profile); // 发送数据
}).catch(err => {
    console.error('获取用户资料失败', err);
});

// LIFF 初始化
liff.init({
    liffId: '2002831974-oaMLXlv9' // 请替换为您的 LIFF ID
}).then(() => {
    if (!liff.isLoggedIn()) {
        // 用户未登录，引导用户登录
        liff.login();
    } else {
        // 用户已登录，获取用户信息
        liff.getProfile().then(profile => {
            displayUserInfo(profile);
            sendDataToGoogleSheet(profile);
        }).catch(err => {
            console.error('获取用户资料失败', err);
        });
    }
}).catch(err => {
    console.error('LIFF Initialization failed', err);
});

// 显示用户信息
function displayUserInfo(profile) {
    document.getElementById('displayName').textContent = profile.displayName;
    document.getElementById('pictureUrl').src = profile.pictureUrl;
}

// 发送数据到 Google Sheets
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
    };

    fetch('https://script.google.com/macros/s/AKfycbwrb9Pkv_Nt27JqOO6BAqTojtA9h8AndIrG486ShqaE4UQzYYBtesP7dTP9nVhQ8vxD/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
}

// 游戏逻辑
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

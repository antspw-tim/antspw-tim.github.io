liff.init({
    liffId: '2002831974-oaMLXlv9'
}).then(() => {
    if (liff.isLoggedIn()) {
        liff.getProfile().then(profile => {
            document.getElementById('displayName').textContent = profile.displayName;
            document.getElementById('pictureUrl').src = profile.pictureUrl;
            document.getElementById('userId').textContent = '用戶ID: ' + profile.userId;
            document.getElementById('statusMessage').textContent = '狀態消息: ' + profile.statusMessage;
        }).catch(err => {
            console.error('獲取用戶資料失敗', err);
        });
    } else {Ｉ
        // 用戶未登入，引導用戶登入
        liff.login();
    }
}).catch(err => {
    console.error('LIFF Initialization failed', err);
});

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


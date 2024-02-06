liff.init({
    liffId: '2002831974-oaMLXlv9' // 请替换为您的 LIFF ID
}).then(() => {
    if (!liff.isLoggedIn()) {
        // 用户未登录，显示登录屏幕
        showLoginScreen();
    } else {
        // 用户已登录，获取用户信息
        liff.getProfile().then(profile => {
            // 设置全局变量 window.profile
            window.profile = profile;
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
    // 添加其他用户信息显示
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

// Google Sheets API 初始化
gapi.load('client', function() {
    gapi.client.init({
        apiKey: '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', // 您的 Google Sheets API 密钥
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function() {
        console.log('Google Sheets API initialized');
    });
});

// 新的 JavaScript 代碼，用於 Google Sheets API
function recordButtonClick(ingredient) {
    liff.getProfile().then(profile => {
        var lineProfile = {
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl
        };

        var timestamp = new Date().toLocaleString();
        var values = [
            [timestamp, profile.displayName, profile.userId, ingredient]
        ];

        var spreadsheetId = 'YOUR_SPREADSHEET_ID';
        var range = 'Sheet1!A:D';

        var params = {
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: values
            }
        };

        gapi.client.sheets.spreadsheets.values.append(params).then(function(response) {
            console.log('Data recorded successfully in Google Sheets');
        }, function(reason) {
            console.error('Error: ' + reason.result.error.message);
        });
    }).catch(err => {
        console.error('Error getting Line profile', err);
    });
}

function getLineProfile() {
    if (liff.isLoggedIn()) {
        return {
            userId: liff.getContext().userId,
            displayName: liff.getContext().displayName,
            pictureUrl: liff.getContext().profilePicture
        };
    } else {
        return {
            userId: 'Not Logged In',
            displayName: 'Not Logged In',
            pictureUrl: 'Not Logged In'
        };
    }
}

// liff.init 初始化
liff.init({
    liffId: '2002831974-oaMLXlv9' // 請替換為您的 LIFF ID
}).then(() => {
    if (!liff.isLoggedIn()) {
        // 用戶未登錄，顯示登錄屏幕
        showLoginScreen();
    } else {
        // 用戶已登錄，獲取用戶信息
        liff.getProfile().then(profile => {
            // 設置全局變量 window.profile
            window.profile = profile;
            displayUserInfo(profile);
        }).catch(err => {
            console.error('獲取用戶資料失敗', err);
        });
    }
}).catch(err => {
    console.error('LIFF 初始化失敗', err);
});

// 顯示登錄屏幕
function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
}

// 開始遊戲
function startGame() {
    recordUserAction('startGame');
    if (!liff.isLoggedIn()) {
        // 如果用戶未登錄，引導用戶登錄
        liff.login();
    } else {
        // 用戶已登錄，開始遊戲
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
    }
}

// 顯示用戶信息
function displayUserInfo(profile) {
    document.getElementById('displayName').textContent = profile.displayName;
    document.getElementById('pictureUrl').src = profile.pictureUrl;
    // 添加其他用戶信息顯示
}

// 初始化飲品列表
let drinkIngredients = [];

// 添加飲品成分
function addIngredient(ingredient, color) {
    recordUserAction('addIngredient', ingredient);
    drinkIngredients.push(ingredient);
    updateDrinkDisplay();
    animateIngredient(color);
}

// 更新飲品顯示
function updateDrinkDisplay() {
    document.getElementById("drink-result").innerHTML = "加入了" + drinkIngredients.join(", ");
}

// 動畫顯示飲品成分
function animateIngredient(color) {
    const ingredientEl = document.createElement('div');
    ingredientEl.className = 'ingredient';
    ingredientEl.style.backgroundColor = color;
    document.getElementById('shaker-container').appendChild(ingredientEl);

    setTimeout(() => {
        ingredientEl.remove();
    }, 2000);
}

// 開始搖飲品
function startShaking() {
    recordUserAction('startShaking');
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
        apiKey: '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', // 您的 Google Sheets API 密鑰
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function() {
        console.log('Google Sheets API 初始化成功');
        
        // 在这里进行您的操作，确保 gapi.client.sheets 已经被正确初始化

        // Now that the API is loaded, you can execute the code that uses it
        // For example, you can call functions that interact with Google Sheets

    }).catch(function(error) {
        console.error('Google Sheets API 初始化失敗', error);
    });
});

// 記錄用戶行為數據
function recordUserAction(action, ingredient = '') {
    // Ensure gapi.client.sheets is defined before using it
    if (gapi.client.sheets) {
        liff.getProfile().then(profile => {
            var lineProfile = {
                userId: profile.userId,
                displayName: profile.displayName,
                pictureUrl: profile.pictureUrl
            };

            var timestamp = new Date().toLocaleString();
            var values = [
                [timestamp, profile.displayName, profile.userId, action, ingredient]
            ];

            var spreadsheetId = '1U_qsJX8XpjI6CZ4C2vk3tTGm2dp2NDq3N3TRkVpdn3w';
            var range = 'Sheet1!A:E';

            var params = {
                spreadsheetId: spreadsheetId,
                range: range,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: values
                }
            };

            gapi.client.sheets.spreadsheets.values.append(params).then(function(response) {
                console.log('數據成功記錄到 Google Sheets 中');
            }, function(reason) {
                console.error('錯誤: ' + reason.result.error.message);
            });
        }).catch(err => {
            console.error('獲取 Line 用戶資料失敗', err);
        });
    } else {
        // Handle the case where gapi.client.sheets is not defined yet
        console.error('Google Sheets API 未加载完成');
    }
}


// 獲取 LINE 用戶信息
function getLineProfile() {
    if (liff.isLoggedIn()) {
        return {
            userId: liff.getContext().userId,
            displayName: liff.getContext().displayName,
            pictureUrl: liff.getContext().profilePicture
        };
    } else {
        return {
            userId: '未登錄',
            displayName: '未登錄',
            pictureUrl: '未登錄'
        };
    }
}


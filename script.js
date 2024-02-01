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


// Google Sheets API 初始化
gapi.load('client', function() {
    gapi.client.init({
        apiKey: 'AIzaSyBiPqVqKbkvtteTD8EEdN0FRMvZm5nVc44',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function() {
        console.log('Google Sheets API initialized');
    });
});

// 新的 JavaScript 代碼，用於 Google Sheets API
// 定义用于记录按钮点击的函数，接收日期、用户的LINE名称、LINE ID 和 按钮名称作为参数
function recordButtonClick(timestamp, lineDisplayName, lineUserId, buttonName) {
    // 将记录数据存储为二维数组
    var values = [
        [timestamp, lineDisplayName, lineUserId, buttonName]
    ];

    // 定义 Google Sheets API 请求参数
    var params = {
        spreadsheetId: 'YOUR_SPREADSHEET_ID', // 您的 Google Sheets 表格的 ID
        range: 'Sheet1!A:E', // 写入数据的范围
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: values
        }
    };

    // 执行 Google Sheets API 请求
    gapi.client.sheets.spreadsheets.values.append(params).then(function(response) {
        console.log('Data recorded successfully in Google Sheets');
    }, function(reason) {
        console.error('Error: ' + reason.result.error.message);
    });
}

// 每个按钮点击事件处理函数中调用记录函数
function addIngredient(ingredient, color) {
    // 获取当前日期时间
    var timestamp = new Date().toLocaleString();

    // 获取用户的LINE资料
    var lineProfile = getLineProfile();

    // 调用记录函数并传递日期、LINE名称、LINE ID 和 按钮名称作为参数
    recordButtonClick(timestamp, lineProfile.displayName, lineProfile.userId, ingredient);
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
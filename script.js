liff.init({
    liffId: '2002831974-oaMLXlv9'
}).then(() => {
    if (liff.isLoggedIn()) {
        liff.getProfile().then(profile => {
            document.getElementById('displayName').textContent = '暱稱: ' + profile.displayName;
            document.getElementById('pictureUrl').src = profile.pictureUrl;
            document.getElementById('userId').textContent = '用戶ID: ' + profile.userId;
            document.getElementById('statusMessage').textContent = '狀態消息: ' + profile.statusMessage;
        }).catch(err => {
            console.error('獲取用戶資料失敗', err);
        });
    } else {
        // 用戶未登入，引導用戶登入
        liff.login();
    }
}).catch(err => {
    console.error('LIFF Initialization failed', err);
});

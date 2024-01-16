function initializeLiff(liffId) {
    liff.init({
        liffId: liffId
    }).then(() => {
        console.log(liff.isLoggedIn()); 
    }).catch(err => {
        console.error('LIFF Initialization failed', err);
    });
}
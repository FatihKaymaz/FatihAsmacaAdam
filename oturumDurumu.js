// Her girişte oturumun açık olup olmadığını kontrol eden kod:
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // Kullanıcı oturum açmışsa
        // console.log('Oturum açık');
        window.location.href = "girissayfasi.html"
    } else {
        // Kullanıcı oturum açmamışsa veya oturum kapalıysa
        // console.log('Oturum kapalı');
    }
});
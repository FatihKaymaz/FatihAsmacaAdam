// Firebase proje kimliği
const firebaseConfig = {
  apiKey: "AIzaSyCX79bzDQUmlzsxz0id1Bwhy0w4w4T74Os",
  authDomain: "fatihasmacaadam.firebaseapp.com",
  projectId: "fatihasmacaadam",
  storageBucket: "fatihasmacaadam.appspot.com",
  messagingSenderId: "8364281884",
  appId: "1:8364281884:web:92a6260f257e6e2ccf8fd9",
  measurementId: "G-T4P2K541B9"
};
// Firebase'i başlatan kod. (Bu olmazsa firebase bağlantısı sağlanmaz)
firebase.initializeApp(firebaseConfig);

// Kullanıcı oturum açtıktan sonra kullanıcının verilerini almak için "user" isimli bir değişken oluşturduk.
var user;

// Google ile oturum aç:
function GoogleSignIn() {
  // Google ile oturum açma işlemini başlatın:
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then((result) => {
    // Google ile oturum açma başarılı, kullanıcı oturum açma işlemi tamamlandıktan sonra yapılacak işlemler burada yer alır
    // google ile oturum açtıktan sonra verileri sonra kullanmak için tarayıcının içerisine kayıt etmemize yarayan localStorage ile kayıt ettik.
    localStorage.setItem("id", result.user.uid)
    localStorage.setItem("name", result.user.displayName)
    localStorage.setItem("photo", result.user.photoURL)
    // console.log('Google ile giriş yapıldı:', user);
  })
  .catch((error) => {
    // Hata durumunda yapılacak işlemler
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Hata:", errorMessage);
  });
}

// Oturumu kapat:
function SignOut() {
  firebase.auth().signOut().then(() => {
    // Oturum kapatma başarılı
    // console.log('Oturum kapatıldı');
    // Oturum kapatıldıktan sonra tarayıcıda tutulan oturum ile ilgili verileri siliyoruz.
    localStorage.removeItem("id")
    localStorage.removeItem("name")
    localStorage.removeItem("photo")
    // Oturum kapatma ile ilgili tüm işlemler tamamlandığında terkardan oturum açma sayfasına yönlendiriyoruz.
    window.location.href="index.html"
  }).catch((error) => {
    // Hata durumunda
    console.error('Oturum kapatma hatası:', error);
  });
}

// Sayfadaki genel div'i seçtik:
const oturumCercevesi = document.getElementById("geneldiv")

// Başlangıçta "ekranGenisligiAyarlamasi()" fonksiyonunu bir kere manuel çalıştırıyoruz:
ekranGenisligiAyarlamasi()

// Genişlik ayarları:
function ekranGenisligiAyarlamasi() {

    // Oturum Çerçevesi Style isimli bir değişkene, oturumCercevesi'nin style özelliği'ni atadık:
    const ocs = oturumCercevesi.style

    // Oturum çerçevesini yukarıdan ortalamak için oturumCercevesi'nin uzunluğunun yarısını alıp, yukarıdan verdiğimiz boşluktan çıkardık:
    ocs.marginTop=-(oturumCercevesi.clientHeight/2)+"px"
}

// Ana sayfada şu anda sahip olduğumuz skor verisini ana sayfaya yazdırmak için "girissayfasiID" divini seçtik.
const girissayfasiID = document.getElementById("girissayfasiID")
// Oturum açarken almış olduğumuz kullanıcının id değerini, veritabanında sorgu yapmak için tekrar aldık.
var id = localStorage.getItem("id")

// Veritabanından kullanıcının id'sinin altındaki skor verisini çekip "girissayfasiID"ye yazdırıyoruz.
firebase.database().ref("Kullanicilar").child(id).once("value", (snapshot)=>{
  var data = snapshot.val()
  girissayfasiID.innerHTML = "Skorunuz: " + data.skor
})
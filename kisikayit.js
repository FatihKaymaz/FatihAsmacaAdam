// Bu kısımda script.js'de kayıt ettiğimiz verileri değişkenlere aldık:
var id = localStorage.getItem("id")
const name = localStorage.getItem("name")
const photo = localStorage.getItem("photo")

// Kişinin önceden kayıtlı olup olmadığını anlamak için oluşturduğumuz değişken. (Başlangıç değeri olarak "false" yani kayıtlı değil dedik.):
var kisi_var_mi = false

// Burda da kişiyi eğer veri tabanına kayıt edeceksek verilerini İsim ve Fotoğraf şeklinde veri tabanına kayıt etmek için json bir veri oluşturduk:
var kayit = {
    Isim: name,
    Fotograf: photo,
    skor: 0
}

// Hemen aşağıdaki kodda veri tabanındaki, kullanıcılar düğümü altındaki kullanıcıları çekip bir fonksiyon içine attık:
firebase.database().ref("Kullanicilar").once("value", (snapshot)=>{

    // Burda da çekilen verilerin sadece anahtar kısmını almak için veri tabanından çektiğimiz veriyi "snapshot.val()"ı, Object.keys() içine alıp sadece baş kısmını aldık:
    var key = Object.keys(snapshot.val())

    // forEach, dizilerin uzunluğu kadar dönen bir döngüdür. Yukarıda veritabanından almış olduğumuz verileri bir dizi yapıp burada da dizinin içindeki her şeyi tek tek giriş yapan kişinin ID'si ile eşit mi "yani kişi önceden kayıtlı mı?" diye kontrol ettik. Kişi varsa kisi_var_mi değişkeni true oldu:
    key.forEach(function(key) {
        if (key == id) {
            kisi_var_mi = true
        }
    })

    // Eğer kişi yoksa veri tabanına kayıt ediyoruz:
    if(kisi_var_mi==false){
        // Kullanıcıyı veri tabanına kayıt eder:
        firebase.database().ref("Kullanicilar").child(id).set(kayit)
    }
})
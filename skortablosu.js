// Bu dosya, ana sayfada bulunan en çok puan alan ilk 5 kişinin sıralanmasını sağlayan javascript dosyasıdır.

// Burda en çok puan alan ilk beş kişinin isminin tutulduğu sabitler bulunuyor:
const puankutusu1isim = document.getElementById("puankutusu1-isim")
const puankutusu2isim = document.getElementById("puankutusu2-isim")
const puankutusu3isim = document.getElementById("puankutusu3-isim")
const puankutusu4isim = document.getElementById("puankutusu4-isim")
const puankutusu5isim = document.getElementById("puankutusu5-isim")

// Burda en çok puan alan ilk beş kişinin skorlarının tutulduğu sabitler bulunuyor:
const puankutusu1skor = document.getElementById("puankutusu1-skor")
const puankutusu2skor = document.getElementById("puankutusu2-skor")
const puankutusu3skor = document.getElementById("puankutusu3-skor")
const puankutusu4skor = document.getElementById("puankutusu4-skor")
const puankutusu5skor = document.getElementById("puankutusu5-skor")

// Burda en çok puan alan ilk beş kişinin resimlerinin tutulduğu sabitler bulunuyor:
const puankutusu1resim = document.getElementById("puankutusu1-resim")
const puankutusu2resim = document.getElementById("puankutusu2-resim")
const puankutusu3resim = document.getElementById("puankutusu3-resim")
const puankutusu4resim = document.getElementById("puankutusu4-resim")
const puankutusu5resim = document.getElementById("puankutusu5-resim")

// skorbelirtme değişkeninde json veri tutacağımızı belirttik.
var  skorbelirtme = {}
// Veritabanından kullanıcıları çektiğimizde kaç kullnıcı varsa aşağıda kullandığımız bir döngüyü o kadar kere çevirmemize yarayacak bir değişken. Yani sitede 50 kişi kayıtlı ise 50'ye kadar artıp döngümüzü çevirmemize yarıyor.
var dongu = 0

// Veritabanından kullanıcılar düğümündeki kullanıcıları çekiyoruz.
firebase.database().ref("Kullanicilar").once("value",(snapshot)=>{
    // bu alanda ilk değişkende çekilen verileri aldık. ikinci değişkende ise çekilen verinin sadece anahtar kısmını, yani veritabanımızda kullanıcıların id'lerine karşılık gelen kısmı depoluyoruz.
    var data = snapshot.val()
    var verikeyss = Object.keys(snapshot.val())
    
    // Çekilen id'leri kaç tane ise, yani sitede kaç kullanıcı varsa, o kadar kere forEach ile döndürüyoruz. 
    verikeyss.forEach(function name(anahtarlar) {
        // console.log(anahtarlar + " " + data[anahtarlar].skor)
        // skorbelirtme isminde oluşturduğumuz objeye, döngü değişkeni sayesinde, yani başlangıç değeri 0 olan değişkenle, her bir kişinin skor, isim ve resim verisini tek tek json şeklinde depoluyoruz. Her bir kullanıcının verisi bir sayıya karşılık geliyor (0, 1, 2, 3 gibi).
        // Atama yaptığımız kısımı açıklamamız gerekirse, skor kısmının karşısına, o kullanıcının skor verisini, isim karşısına isim verisini, fotoğraf karşısına fotoğraf verisini atayıp, en sonda ise bunu üstteki yorum satırında açıklamış olduğumuz değişkene atıyoruz.
        skorbelirtme[dongu] = {skor: data[anahtarlar].skor, isim: data[anahtarlar].Isim, foto: data[anahtarlar].Fotograf}
        // Bir sonraki kişiyi atarken onun bir sonraki sayıya atanmasını sağlamak için, döngü değişkenini 1 arttırıyoruz.
        dongu++
    })

    // skorlar isminde bir dizi oluşturduk.
    var skorlar = []
    // skorsahibibilgileri isimli bir dizi oluşturduk.
    var skorsahibibilgileri = []
    // yukarıda oluşturduğumuz iki dizinin oluşturulma sebebi, kişileri ve skorlarını aynı sıra ile aşağıda chatGPT'den almış olduğumuz kod ile aynı sırayla iki diziye farklı farklı atıyoruz. Aşağıda skor durumuna göre dizileri düzenlediğimizde iki dizide de aynı değişiklikleri aynı anda yapıyoruz ki skor sırası değişirken aynı anda skorun sahiplerini de aynı şekilde değiştiriyoruz. Bu iki dizi bu sebepten oluşturuldu.

    // Bu döngüde veritabanından çekilen verileri yazdırmış olduğumuz skorbelirtme dizisinden teker teker kişerin skorlarını skorlar dizisine, diğer verilerini ise skorsahibibilgileri dizisine aynı sıra ile i değişkeni sayesinde teker teker atıyoruz.
    for (var i = 0; i < dongu; i++) {
        // console.log(skorbelirtme[i].id + " "+ skorbelirtme[i].skor)

        skorlar.push(skorbelirtme[i].skor)
        skorsahibibilgileri.push({isim: skorbelirtme[i].isim, foto: skorbelirtme[i].foto})
    }

    // skorKullanicilar isminde bir dizi oluşturduk.
    var skorKullanicilar = [];
    // Bu alanda yukarıdaki döngüde doldurduğumuz iki farklı diziyi bu alanda sahipleri ile birleştiriyoruz. Aslında bu alan daha güzel kodlanabilirdi ama neden böyle yapmışız bilmiyorum :).
    for (var i = 0; i < skorlar.length; i++) {
        skorKullanicilar.push({ skor: skorlar[i], kullaniciBilgileri: skorsahibibilgileri[i] });
    }

    // skorKullanicilar dizisini sort fonksiyonu ile skor verilerine göre sıralatıyoruz. Bu kodu da chatGPT'den aldık.
    skorKullanicilar.sort(function(a, b) {
        return b.skor - a.skor;
    });

    // yeniden sıralanmış olan skorKullanicilar'ı dizisinden ilk 5 kullanıcıyı kesip, ilkBesKisi dizisine atıyoruz. Artık dizimiz yazdırılmaya hazır.
    var ilkBesKisi = skorKullanicilar.slice(0, 5);

    // Burdan aşağıdaki tüm kodlar, ilkBesKisi isimli diziyi html belgesine yazdırmamıza yarayan kodlar. Sadece sitede 5 kişiden az kişi varsa ilkBesKisi isimli dizide 5 kişi olmayacak. Bu durumda yazdırma kısmında hata almamak için o kişinin olup olmadığını if ile kontrol edip, varsa ondan sonra html sitesine yazdırıyoruz.
    if (ilkBesKisi[0])
    {
        puankutusu1isim.innerHTML = ilkBesKisi[0].kullaniciBilgileri.isim  
        puankutusu1skor.innerHTML = ilkBesKisi[0].skor
        puankutusu1resim.src = ilkBesKisi[0].kullaniciBilgileri.foto
    }

    if (ilkBesKisi[1])
    {
        puankutusu2isim.innerHTML = ilkBesKisi[1].kullaniciBilgileri.isim
        puankutusu2skor.innerHTML = ilkBesKisi[1].skor
        puankutusu2resim.src = ilkBesKisi[1].kullaniciBilgileri.foto
    }

    if (ilkBesKisi[2])
    {
        puankutusu3isim.innerHTML = ilkBesKisi[2].kullaniciBilgileri.isim
        puankutusu3skor.innerHTML = ilkBesKisi[2].skor
        puankutusu3resim.src = ilkBesKisi[2].kullaniciBilgileri.foto
    }

    if (ilkBesKisi[3])
    {
        puankutusu4isim.innerHTML = ilkBesKisi[3].kullaniciBilgileri.isim
        puankutusu4skor.innerHTML = ilkBesKisi[3].skor
        puankutusu4resim.src = ilkBesKisi[3].kullaniciBilgileri.foto
    }

    if (ilkBesKisi[4])
    {
       puankutusu5isim.innerHTML = ilkBesKisi[4].kullaniciBilgileri.isim
       puankutusu5skor.innerHTML = ilkBesKisi[4].skor
       puankutusu5resim.src = ilkBesKisi[4].kullaniciBilgileri.foto
    }
    
    // kutu1.innerHTML=ilkBesKisi[0].skor + " " + ilkBesKisi[0].kullaniciBilgileri.isim + " " + ilkBesKisi[0].kullaniciBilgileri.foto
    // kutu2.innerHTML=ilkBesKisi[1].skor + " " + ilkBesKisi[1].kullaniciBilgileri.isim + " " + ilkBesKisi[1].kullaniciBilgileri.foto
    // kutu3.innerHTML=ilkBesKisi[2].skor + " " + ilkBesKisi[2].kullaniciBilgileri.isim + " " + ilkBesKisi[2].kullaniciBilgileri.foto
    // kutu4.innerHTML=ilkBesKisi[3].skor + " " + ilkBesKisi[3].kullaniciBilgileri.isim + " " + ilkBesKisi[3].kullaniciBilgileri.foto
    // kutu5.innerHTML=ilkBesKisi[4].skor + " " + ilkBesKisi[4].kullaniciBilgileri.isim + " " + ilkBesKisi[4].kullaniciBilgileri.foto

    // console.log(ilkBesKisi)

})
// Oyuncunun id'sini önceden kayıt etmiş olduğumuz localStorage'den alıyoruz.
const oyuncuid = localStorage.getItem("id")
// oyunekrani.html'deki şıkları tek tek sabitlere atıyoruz.
const A = document.getElementById("A")
const B = document.getElementById("B")
const C = document.getElementById("C")
const D = document.getElementById("D")
const E = document.getElementById("E")

const oyunmodu = window.location.search

// Çevirisini sorduğumuz kelimeyi yazdırdığımız divi sabite atadık.
const kelimeDiv = document.getElementById("kelime")
// Asılan adam resimlerin gösterildiği img etiketini sabite atadık.
const hataIMG = document.getElementById("hata")
// Oyun bittiğinde karşımıza çıkan "oyun bitti" kutusu.
const bitisdivi = document.getElementById("bitis")
// Oyun esnasında skor verisini yazdırdığımız skor kutusu.
const skor = document.getElementById("score")
// Oyun bitti ekranına oyun boyunca elde edilen skor verisini yazdırdığımız skor kutusu.
const skorP = document.getElementById("skorP")

// Bu alanda kod akışı sırasında "public" olarak, yani her yerden erişilebilir olarak tanımlamamız gereken değişkenler bulunuyor.

// Doğru cevabın tutulduğu değişken.
var rastgele3
// Kullanıcının oyun boyunca yaptığı yanlışları sayar. Bu sayede hakkının dolup dolmadığını aşağıdaki şık kontrolunu sağladığımız alanda kontrol edebilelim. 
var yanlissayaci = 0
// Oyun sırasında skor verisinin tutulduğu değişeken.
var score = 0

// Bu fonksiyon, gelen iki değer arasından rastgele bir sayıyı seçmek için chatGPT'den alınıştır. Oluşturulma amacı veritabanındaki kelimelerden birini rastgele seçmek ve o değeri geri döndürmek.
function rastgeleKelime(min, max) {
    var rastgele1 = Math.floor(Math.random() * (max - min) + min)
    return rastgele1
}

// Bu fonksiyon ise Math.random() ile 0 ile 1 arasında rastgele bir sayı üretiyor. Bu üretilen sayı 0.5'in altında ise "true" değeri, değilse de "false" değeri dönüyor. bu fonksiyonu oyun esnasında sorulacak sorunun İngilizce mi yoksa Türkçe mi olacağını belirlemek için kullandık. Bu fonksiyonda %50'ye 50 ihtimalin olması için 0.5 değerini seçtik. İhtimali değiştirmek için 0.5 değerini yukarı ya da aşağı çekerek değiştirebiliz. 
function rastgeleDurum() {
    var rastgele2 = Math.random()
    if (rastgele2 < 0.5) {
        return true // turkçe
    }
    else {
        return false // ingilizce
    }
}

// Bu fonksiyon da doğru cevabın hangi şık olacağını belirliyor. 1 ile 5 arasında rastgele bir sayı belirliyor. 1=A, 2=B, 3=C, 4=D, 5=E şıklarına karşılık geliyor. Gelen sayı o şıkkın doğru cevap olacağını söylüyor
function dogruCevap() {
    rastgele3 = Math.floor(Math.random() * (6 - 1) + 1)
    return rastgele3
}

// Oyunun ta kendisi. Oyun fonksiyonu. (Karışık)
function oyunDongusuMIX() {
    // Veritabanındaki "Kelimeler" düğümünü çekiyoruz.
    firebase.database().ref("Kelimeler").once("value", (snapshot) => {
        // Veri tabanımızdaki düzende, anahtarlar türkçe kelime, değerler ise ingilizce kelimeler olarak belirlendi. Yani bir veride anahtar türkçe değerler ingilizce. Bu yüzden de anahtarları "turce" dizisine, değerleri de "ingilicce" dizisine atadık.
        var turkce = Object.keys(snapshot.val())
        var ingilicce = Object.values(snapshot.val())

        // Bu alanda veritabanındaki kelimelerden birini rastgele seçip kulanıcıya bunlardan bi tanesini sormamız için yukarıda oluşturmuş olduğumuz "rastgeleKelime()" fonksiyonuna, minimum değeri 0 olarak -çünkü saymaya 0'dan başlıyoruz-, maksimum değeri de veritabanında bulunan kaç kelime varsa o değeri turkce.length ifadesi ile -yani "turkce" dizisinin uzunluğu ile- tespit ettik. Bunun "ingilicce" dizisi ilede yapabilirdik. Fark etmezdi.
        var gelenKelimeSayisi = rastgeleKelime(0, turkce.length)

        // Bu alanda "cevap1","cevap2","cevap3","cevap4" diye 4 faklı değişken oluşturduk. Bu değişkenlerin amacı, oyuncuya sorduğumuz soruda, aşağıdaki doğru olan şık haricinde kalan 4 şıkka da veritabanından rastgele bir kelime seçip yazdırmak. Ancak bunu yaparken 4 şıkkın hepsinin farklı bir değer geleceğinin garantisi yoktu. Bu yüzden if'ler ile bazı şıkları birbiri ile aynı mı diye kontrol ettirip, aynı ise şıklardan birine tekrardan rastgele bir değer atadık. Ancak buna rağmen %100 tüm şıklar farklı gelecek diye bir şey yok. Ancak ihtimal azalmış oldu. Buna rağmen test aşamasında gene de iki şıkkın birbiri ile aynı olduğunu gördüm :).
        var cevap1 = rastgeleKelime(0, ingilicce.length)
        var cevap2 = rastgeleKelime(0, ingilicce.length)
        if (cevap1 == cevap2) {
            cevap2 = rastgeleKelime(0, ingilicce.length)
        }
        var cevap3 = rastgeleKelime(0, ingilicce.length)
        if (cevap2 == cevap3) {
            cevap3 = rastgeleKelime(0, ingilicce.length)
        }
        var cevap4 = rastgeleKelime(0, ingilicce.length)
        if (cevap3 == cevap4) {
            cevap4 = rastgeleKelime(0, ingilicce.length)
        }


        // Bu if bloğunda, yukarıda oluşturmuş olduğumuz "rastgeleDurum()" fonksiyonunu çağırdık. Bu fonksiyon bize rastgele olarak "true" veya "false" değerini döndürüyor. Gelen değer "true" ise sorulacak kelimeyi Türkçe olarak belirledik. "false" ise if boğumuzun else kısmını çalıştırıp, sorulacak olan kelimenin İngilizce olmasını sağlıyoruz.
        if (rastgeleDurum() == true) {
            // Türkçe kelime yukarıda:

            // "turce" dizisindeki, yukarıda rastgeleKelime() fonksiyonu ile belirlemiş olduğumuz rastlele bir sayıyı turkce dizisinden alıp kelimeDiv'e yazdırıyoruz.
            kelimeDiv.innerHTML = turkce[gelenKelimeSayisi]

            // "dogruCevap()" fonksiyonundan doğru cevabın hangi şık olacağını öğreniyoruz.
            var Cevap = dogruCevap()

            // Bu alanda doğru cevap hangi şık ise, doğru cevabı o şıkka yazdırmak için "Cevap" değerini kontrol edip, değer 1 ise doğru cevabın A'ya, 2 ise B'ye gibi yazdırmasını sağlıyoruz. Bu alanda kontrol için if else kullanabilirdik ama switch case yazma açısından daha kolay ve daha uygun olduğu için bu yöntemi kullandık.
            switch (Cevap) {
                case 1:
                    A.value = ingilicce[gelenKelimeSayisi]
                    B.value = ingilicce[cevap1]
                    C.value = ingilicce[cevap2]
                    D.value = ingilicce[cevap3]
                    E.value = ingilicce[cevap4]
                    break;

                case 2:
                    A.value = ingilicce[cevap1]
                    B.value = ingilicce[gelenKelimeSayisi]
                    C.value = ingilicce[cevap2]
                    D.value = ingilicce[cevap3]
                    E.value = ingilicce[cevap4]
                    break;

                case 3:
                    A.value = ingilicce[cevap1]
                    B.value = ingilicce[cevap2]
                    C.value = ingilicce[gelenKelimeSayisi]
                    D.value = ingilicce[cevap3]
                    E.value = ingilicce[cevap4]
                    break;

                case 4:
                    A.value = ingilicce[cevap1]
                    B.value = ingilicce[cevap2]
                    C.value = ingilicce[cevap3]
                    D.value = ingilicce[gelenKelimeSayisi]
                    E.value = ingilicce[cevap4]
                    break;

                case 5:
                    A.value = ingilicce[cevap1]
                    B.value = ingilicce[cevap2]
                    C.value = ingilicce[cevap3]
                    D.value = ingilicce[cevap4]
                    E.value = ingilicce[gelenKelimeSayisi]
                    break;
            }
        }
        else {
            // İngilizce kelime yukarıda:

            // Bu alandaki kodlar da if bloğunun ilk kısmındaki kodlarla aynı ama sadece Türkçe ile İngilizce dizilerini tam tersi kullanarak tersine dönmesini sağladık.
            kelimeDiv.innerHTML = ingilicce[gelenKelimeSayisi]

            var Cevap = dogruCevap()


            switch (Cevap) {
                case 1:
                    A.value = turkce[gelenKelimeSayisi]
                    B.value = turkce[cevap1]
                    C.value = turkce[cevap2]
                    D.value = turkce[cevap3]
                    E.value = turkce[cevap4]
                    break;

                case 2:
                    A.value = turkce[cevap1]
                    B.value = turkce[gelenKelimeSayisi]
                    C.value = turkce[cevap2]
                    D.value = turkce[cevap3]
                    E.value = turkce[cevap4]
                    break;

                case 3:
                    A.value = turkce[cevap1]
                    B.value = turkce[cevap2]
                    C.value = turkce[gelenKelimeSayisi]
                    D.value = turkce[cevap3]
                    E.value = turkce[cevap4]
                    break;

                case 4:
                    A.value = turkce[cevap1]
                    B.value = turkce[cevap2]
                    C.value = turkce[cevap3]
                    D.value = turkce[gelenKelimeSayisi]
                    E.value = turkce[cevap4]
                    break;

                case 5:
                    A.value = turkce[cevap1]
                    B.value = turkce[cevap2]
                    C.value = turkce[cevap3]
                    D.value = turkce[cevap4]
                    E.value = turkce[gelenKelimeSayisi]
                    break;
            }
        }
    })
}

// Oyun (Türkçe -> İngilizce)
function oyunDongusuTR() {
    // Veritabanındaki "Kelimeler" düğümünü çekiyoruz.
    firebase.database().ref("Kelimeler").once("value", (snapshot) => {
        // Veri tabanımızdaki düzende, anahtarlar türkçe kelime, değerler ise ingilizce kelimeler olarak belirlendi. Yani bir veride anahtar türkçe değerler ingilizce. Bu yüzden de anahtarları "turce" dizisine, değerleri de "ingilicce" dizisine atadık.
        var turkce = Object.keys(snapshot.val())
        var ingilicce = Object.values(snapshot.val())

        // Bu alanda veritabanındaki kelimelerden birini rastgele seçip kulanıcıya bunlardan bi tanesini sormamız için yukarıda oluşturmuş olduğumuz "rastgeleKelime()" fonksiyonuna, minimum değeri 0 olarak -çünkü saymaya 0'dan başlıyoruz-, maksimum değeri de veritabanında bulunan kaç kelime varsa o değeri turkce.length ifadesi ile -yani "turkce" dizisinin uzunluğu ile- tespit ettik. Bunun "ingilicce" dizisi ilede yapabilirdik. Fark etmezdi.
        var gelenKelimeSayisi = rastgeleKelime(0, turkce.length)

        // Bu alanda "cevap1","cevap2","cevap3","cevap4" diye 4 faklı değişken oluşturduk. Bu değişkenlerin amacı, oyuncuya sorduğumuz soruda, aşağıdaki doğru olan şık haricinde kalan 4 şıkka da veritabanından rastgele bir kelime seçip yazdırmak. Ancak bunu yaparken 4 şıkkın hepsinin farklı bir değer geleceğinin garantisi yoktu. Bu yüzden if'ler ile bazı şıkları birbiri ile aynı mı diye kontrol ettirip, aynı ise şıklardan birine tekrardan rastgele bir değer atadık. Ancak buna rağmen %100 tüm şıklar farklı gelecek diye bir şey yok. Ancak ihtimal azalmış oldu. Buna rağmen test aşamasında gene de iki şıkkın birbiri ile aynı olduğunu gördüm :).
        var cevap1 = rastgeleKelime(0, ingilicce.length)
        var cevap2 = rastgeleKelime(0, ingilicce.length)
        if (cevap1 == cevap2) {
            cevap2 = rastgeleKelime(0, ingilicce.length)
        }
        var cevap3 = rastgeleKelime(0, ingilicce.length)
        if (cevap2 == cevap3) {
            cevap3 = rastgeleKelime(0, ingilicce.length)
        }
        var cevap4 = rastgeleKelime(0, ingilicce.length)
        if (cevap3 == cevap4) {
            cevap4 = rastgeleKelime(0, ingilicce.length)
        }


        // Bu if bloğunda, yukarıda oluşturmuş olduğumuz "rastgeleDurum()" fonksiyonunu çağırdık. Bu fonksiyon bize rastgele olarak "true" veya "false" değerini döndürüyor. Gelen değer "true" ise sorulacak kelimeyi Türkçe olarak belirledik. "false" ise if boğumuzun else kısmını çalıştırıp, sorulacak olan kelimenin İngilizce olmasını sağlıyoruz.
                    // Türkçe kelime yukarıda:

            // "turce" dizisindeki, yukarıda rastgeleKelime() fonksiyonu ile belirlemiş olduğumuz rastlele bir sayıyı turkce dizisinden alıp kelimeDiv'e yazdırıyoruz.
            kelimeDiv.innerHTML = turkce[gelenKelimeSayisi]

            // "dogruCevap()" fonksiyonundan doğru cevabın hangi şık olacağını öğreniyoruz.
            var Cevap = dogruCevap()

            // Bu alanda doğru cevap hangi şık ise, doğru cevabı o şıkka yazdırmak için "Cevap" değerini kontrol edip, değer 1 ise doğru cevabın A'ya, 2 ise B'ye gibi yazdırmasını sağlıyoruz. Bu alanda kontrol için if else kullanabilirdik ama switch case yazma açısından daha kolay ve daha uygun olduğu için bu yöntemi kullandık.
            switch (Cevap) {
                case 1:
                    A.value = ingilicce[gelenKelimeSayisi]
                    B.value = ingilicce[cevap1]
                    C.value = ingilicce[cevap2]
                    D.value = ingilicce[cevap3]
                    E.value = ingilicce[cevap4]
                    break;

                case 2:
                    A.value = ingilicce[cevap1]
                    B.value = ingilicce[gelenKelimeSayisi]
                    C.value = ingilicce[cevap2]
                    D.value = ingilicce[cevap3]
                    E.value = ingilicce[cevap4]
                    break;

                case 3:
                    A.value = ingilicce[cevap1]
                    B.value = ingilicce[cevap2]
                    C.value = ingilicce[gelenKelimeSayisi]
                    D.value = ingilicce[cevap3]
                    E.value = ingilicce[cevap4]
                    break;

                case 4:
                    A.value = ingilicce[cevap1]
                    B.value = ingilicce[cevap2]
                    C.value = ingilicce[cevap3]
                    D.value = ingilicce[gelenKelimeSayisi]
                    E.value = ingilicce[cevap4]
                    break;

                case 5:
                    A.value = ingilicce[cevap1]
                    B.value = ingilicce[cevap2]
                    C.value = ingilicce[cevap3]
                    D.value = ingilicce[cevap4]
                    E.value = ingilicce[gelenKelimeSayisi]
                    break;
            }
    })
}

// Oyun (İngilizce -> Türkçe)
function oyunDongusuEN() {
    // Veritabanındaki "Kelimeler" düğümünü çekiyoruz.
    firebase.database().ref("Kelimeler").once("value", (snapshot) => {
        // Veri tabanımızdaki düzende, anahtarlar türkçe kelime, değerler ise ingilizce kelimeler olarak belirlendi. Yani bir veride anahtar türkçe değerler ingilizce. Bu yüzden de anahtarları "turce" dizisine, değerleri de "ingilicce" dizisine atadık.
        var turkce = Object.keys(snapshot.val())
        var ingilicce = Object.values(snapshot.val())

        // Bu alanda veritabanındaki kelimelerden birini rastgele seçip kulanıcıya bunlardan bi tanesini sormamız için yukarıda oluşturmuş olduğumuz "rastgeleKelime()" fonksiyonuna, minimum değeri 0 olarak -çünkü saymaya 0'dan başlıyoruz-, maksimum değeri de veritabanında bulunan kaç kelime varsa o değeri turkce.length ifadesi ile -yani "turkce" dizisinin uzunluğu ile- tespit ettik. Bunun "ingilicce" dizisi ilede yapabilirdik. Fark etmezdi.
        var gelenKelimeSayisi = rastgeleKelime(0, turkce.length)

        // Bu alanda "cevap1","cevap2","cevap3","cevap4" diye 4 faklı değişken oluşturduk. Bu değişkenlerin amacı, oyuncuya sorduğumuz soruda, aşağıdaki doğru olan şık haricinde kalan 4 şıkka da veritabanından rastgele bir kelime seçip yazdırmak. Ancak bunu yaparken 4 şıkkın hepsinin farklı bir değer geleceğinin garantisi yoktu. Bu yüzden if'ler ile bazı şıkları birbiri ile aynı mı diye kontrol ettirip, aynı ise şıklardan birine tekrardan rastgele bir değer atadık. Ancak buna rağmen %100 tüm şıklar farklı gelecek diye bir şey yok. Ancak ihtimal azalmış oldu. Buna rağmen test aşamasında gene de iki şıkkın birbiri ile aynı olduğunu gördüm :).
        var cevap1 = rastgeleKelime(0, ingilicce.length)
        var cevap2 = rastgeleKelime(0, ingilicce.length)
        if (cevap1 == cevap2) {
            cevap2 = rastgeleKelime(0, ingilicce.length)
        }
        var cevap3 = rastgeleKelime(0, ingilicce.length)
        if (cevap2 == cevap3) {
            cevap3 = rastgeleKelime(0, ingilicce.length)
        }
        var cevap4 = rastgeleKelime(0, ingilicce.length)
        if (cevap3 == cevap4) {
            cevap4 = rastgeleKelime(0, ingilicce.length)
        }


        // Bu if bloğunda, yukarıda oluşturmuş olduğumuz "rastgeleDurum()" fonksiyonunu çağırdık. Bu fonksiyon bize rastgele olarak "true" veya "false" değerini döndürüyor. Gelen değer "true" ise sorulacak kelimeyi Türkçe olarak belirledik. "false" ise if boğumuzun else kısmını çalıştırıp, sorulacak olan kelimenin İngilizce olmasını sağlıyoruz.
            // İngilizce kelime yukarıda:

            // Bu alandaki kodlar da if bloğunun ilk kısmındaki kodlarla aynı ama sadece Türkçe ile İngilizce dizilerini tam tersi kullanarak tersine dönmesini sağladık.
            kelimeDiv.innerHTML = ingilicce[gelenKelimeSayisi]

            var Cevap = dogruCevap()


            switch (Cevap) {
                case 1:
                    A.value = turkce[gelenKelimeSayisi]
                    B.value = turkce[cevap1]
                    C.value = turkce[cevap2]
                    D.value = turkce[cevap3]
                    E.value = turkce[cevap4]
                    break;

                case 2:
                    A.value = turkce[cevap1]
                    B.value = turkce[gelenKelimeSayisi]
                    C.value = turkce[cevap2]
                    D.value = turkce[cevap3]
                    E.value = turkce[cevap4]
                    break;

                case 3:
                    A.value = turkce[cevap1]
                    B.value = turkce[cevap2]
                    C.value = turkce[gelenKelimeSayisi]
                    D.value = turkce[cevap3]
                    E.value = turkce[cevap4]
                    break;

                case 4:
                    A.value = turkce[cevap1]
                    B.value = turkce[cevap2]
                    C.value = turkce[cevap3]
                    D.value = turkce[gelenKelimeSayisi]
                    E.value = turkce[cevap4]
                    break;

                case 5:
                    A.value = turkce[cevap1]
                    B.value = turkce[cevap2]
                    C.value = turkce[cevap3]
                    D.value = turkce[cevap4]
                    E.value = turkce[gelenKelimeSayisi]
                    break;
            }
    })
}

// Oyun ilk başladığında "oyunDongusu()" fonksiyonunu bir kereliğine manuel olarak çalıştırıyoruz. Çalıştırıyoruz ki oyuncu oyunu ilk açtığında ekrana sorusu gelsin.
switch (oyunmodu) {
    case '?secenek=1':
        // console.log("TR")
        oyunDongusuTR()
        break;
    case '?secenek=2':
        // console.log("en")
        oyunDongusuEN()
        break;
    case '?secenek=3':
        // console.log("mix")
        oyunDongusuMIX()
        break;

    default:
        // console.log("mix")
        oyunDongusuMIX()
        break;
}

// Bu alanda A şıkkına tıklandıysa yapılacak olan işlemler var. B, C ve diğer şıklarda da aynı kodlar bulunduğu için sadece buraya açıklama satırı yazıyorum.
document.getElementById("A").addEventListener("click", function() {
    
    // Önceden rastgele3 değişkenine doğru cevabın hangisi olduğunu "dogruCevap()" fonksiyonu ile atamıştık. Şimdi bu kısım A şıkkına tıklandıysa çalışan kısım. A şıkkına tıklandıktan sonra bu if bloğunda rastgele3 değerinin, 1'e eşit olup olmadığını kontrol ediyoruz. 1'e eşitse doğru cevap zaten A şıkkı olacağından, doğru cevap verildiğinde yapılacak olan işlemler bulunuyor. Yanlış tıklanmışsa da else kısmı çalışacak.
    if (rastgele3 == 1) 
    {
        // console.log("Doğru Cevap")
        // Doğru cevap verildiğinde oyun içinde depoladığımız skor verisini 10 arttırıyoruz. 
        score = score + 10
        // Arttırdığımız değeri tekrardan skor kutusuna yazdırıyoruz.
        skor.innerHTML = "Skor: " + score
        // Sonrasında arttırmış olduğumuzdeğeri kullanıcını veritabanındaki skor değerinin oraya güncellememiz lazım. Veritabanında "Kullanıcılar" düğümünün altında buluan, şu anda sadece oyunda olan kişinin değerine etki etmek için oyuncuid'de depolamış olduğumuz o oyuncunun düğümüne ulaşıyoruz. Çünkü veritabanında kişileri id'lerine göre kayıt ettik. 
        firebase.database().ref("Kullanicilar").child(oyuncuid).once("value", (snapshot)=>{
            // Çektiğimiz değerleri data değişkenine atadık.
            var data=snapshot.val()
            // data altında bulunan skor verisini 10 arttırdık ve yeni veriyi puan değişkenine atadık.
            var puan=data.skor+10
            // En sonunda değiştirdiğimiz veriyi tekrardan o kulanıcının altına yazıyoruz. 
            firebase.database().ref("Kullanicilar").child(oyuncuid).update({
                skor: puan
            })
        })
        // Doğru cevap verildiği için diğer sorunun gelmesini sağlayan oyunDongusu() fonksiyonunu tekrardan çalıştırıyoruz.
        switch (oyunmodu) {
            case '?secenek=1':
                // console.log("TR")
                oyunDongusuTR()
                break;
            case '?secenek=2':
                // console.log("en")
                oyunDongusuEN()
                break;
            case '?secenek=3':
                // console.log("mix")
                oyunDongusuMIX()
                break;
        
            default:
                // console.log("mix")
                oyunDongusuMIX()
                break;
        }


    }
    else
    {
        // console.log("Yanlış Cevap")
        // Cevap yanlış olduğu için, 1 hakkını yakıyoruz. Yani yanlissayaci'nı 1 arttırdık.
        yanlissayaci++
        // Yaptığı hata 6. hata ise, son şansını da bitirmiş demektir. Bu yüzden bu if adam asımının son fotoğrafını ekrana yazdırır. Tüm şıkları etkisiz hale getirir ve bitiş kutusunu ekrana getirip yapılan skor verisini de bitiş kutusunun içine yazdırır.
        if(yanlissayaci==6)
        {
            hataIMG.src="alet edevat/Ani7.png"
            // oyun bitti (tekrar dene ve çıkış butonu eğer fantezi istiyorsan kaç doğru falan filan.)
            bitisdivi.style.display="block"
            skorP.innerHTML=score
            A.disabled="disabled"
            B.disabled="disabled"
            C.disabled="disabled"
            D.disabled="disabled"
            E.disabled="disabled"


        }
        // Eğer yaptığı hata 1, 2, 3, 4 ve 5. hatalardan biri ise burdaki switch case ile yakalayıp, adam asım resmini yaptığı hata sayısına göre güncelliyoruz.
        switch (yanlissayaci) {
            case 1:
                hataIMG.src="alet edevat/Ani2.png"
                break;
            case 2:
                hataIMG.src="alet edevat/Ani3.png"
                break;
            case 3:
                hataIMG.src="alet edevat/Ani4.png"
                break;
            case 4:
                hataIMG.src="alet edevat/Ani5.png"
                break;
            case 5:
                hataIMG.src="alet edevat/Ani6.png"
                break;
        }
       
        
    }

    
})

// Burdan sonraki B, C, D ve E şıkları için de A şıkkına yazmış olduğumuz kodlar geçerli.
document.getElementById("B").addEventListener("click", function() {

    if (rastgele3 == 2) 
    {
        // console.log("Doğru Cevap")
        score = score + 10
        skor.innerHTML = "Skor: " + score
        firebase.database().ref("Kullanicilar").child(oyuncuid).once("value", (snapshot)=>{
            var data=snapshot.val()
            var puan=data.skor+10
            firebase.database().ref("Kullanicilar").child(oyuncuid).update({
                skor: puan
            })
        })
        switch (oyunmodu) {
            case '?secenek=1':
                // console.log("TR")
                oyunDongusuTR()
                break;
            case '?secenek=2':
                // console.log("en")
                oyunDongusuEN()
                break;
            case '?secenek=3':
                // console.log("mix")
                oyunDongusuMIX()
                break;
        
            default:
                // console.log("mix")
                oyunDongusuMIX()
                break;
        }
    }
    else
    {
        // console.log("Yanlış Cevap")
        yanlissayaci++
        if(yanlissayaci==6)
        {
            hataIMG.src="alet edevat/Ani7.png"
            // oyun bitti (tekrar dene ve çıkış butonu eğer fantezi istiyorsan kaç doğru falan filan.)
            bitisdivi.style.display="block"
            skorP.innerHTML=score
            A.disabled="disabled"
            B.disabled="disabled"
            C.disabled="disabled"
            D.disabled="disabled"
            E.disabled="disabled"


        }
        switch (yanlissayaci) {
            case 1:
                hataIMG.src="alet edevat/Ani2.png"
                break;
            case 2:
                hataIMG.src="alet edevat/Ani3.png"
                break;
            case 3:
                hataIMG.src="alet edevat/Ani4.png"
                break;
            case 4:
                hataIMG.src="alet edevat/Ani5.png"
                break;
            case 5:
                hataIMG.src="alet edevat/Ani6.png"
                break;
        }
       
        
    }
    
})

document.getElementById("C").addEventListener("click", function() {

    if (rastgele3 == 3) 
    {
        // console.log("Doğru Cevap")
        score = score + 10
        skor.innerHTML = "Skor: " + score
        firebase.database().ref("Kullanicilar").child(oyuncuid).once("value", (snapshot)=>{
            var data=snapshot.val()
            var puan=data.skor+10
            firebase.database().ref("Kullanicilar").child(oyuncuid).update({
                skor: puan
            })
        })
        switch (oyunmodu) {
            case '?secenek=1':
                // console.log("TR")
                oyunDongusuTR()
                break;
            case '?secenek=2':
                // console.log("en")
                oyunDongusuEN()
                break;
            case '?secenek=3':
                // console.log("mix")
                oyunDongusuMIX()
                break;
        
            default:
                // console.log("mix")
                oyunDongusuMIX()
                break;
        }
    }
    else
    {
        // console.log("Yanlış Cevap")
        yanlissayaci++
        if(yanlissayaci==6)
        {
            hataIMG.src="alet edevat/Ani7.png"
            // oyun bitti (tekrar dene ve çıkış butonu eğer fantezi istiyorsan kaç doğru falan filan.)
            bitisdivi.style.display="block"
            skorP.innerHTML=score
            A.disabled="disabled"
            B.disabled="disabled"
            C.disabled="disabled"
            D.disabled="disabled"
            E.disabled="disabled"


        }
        switch (yanlissayaci) {
            case 1:
                hataIMG.src="alet edevat/Ani2.png"
                break;
            case 2:
                hataIMG.src="alet edevat/Ani3.png"
                break;
            case 3:
                hataIMG.src="alet edevat/Ani4.png"
                break;
            case 4:
                hataIMG.src="alet edevat/Ani5.png"
                break;
            case 5:
                hataIMG.src="alet edevat/Ani6.png"
                break;
        }
       
        
    }
   
})

document.getElementById("D").addEventListener("click", function() {

    if (rastgele3 == 4) 
    {
        // console.log("Doğru Cevap")
        score = score + 10
        skor.innerHTML = "Skor: " + score
        firebase.database().ref("Kullanicilar").child(oyuncuid).once("value", (snapshot)=>{
            var data=snapshot.val()
            var puan=data.skor+10
            firebase.database().ref("Kullanicilar").child(oyuncuid).update({
                skor: puan
            })
        })
        switch (oyunmodu) {
            case '?secenek=1':
                // console.log("TR")
                oyunDongusuTR()
                break;
            case '?secenek=2':
                // console.log("en")
                oyunDongusuEN()
                break;
            case '?secenek=3':
                // console.log("mix")
                oyunDongusuMIX()
                break;
        
            default:
                // console.log("mix")
                oyunDongusuMIX()
                break;
        }
    }
    else
    {
        // console.log("Yanlış Cevap")
        yanlissayaci++
        if(yanlissayaci==6)
        {
            hataIMG.src="alet edevat/Ani7.png"
            // oyun bitti (tekrar dene ve çıkış butonu eğer fantezi istiyorsan kaç doğru falan filan.)
            bitisdivi.style.display="block"
            skorP.innerHTML=score
            A.disabled="disabled"
            B.disabled="disabled"
            C.disabled="disabled"
            D.disabled="disabled"
            E.disabled="disabled"


        }
        switch (yanlissayaci) {
            case 1:
                hataIMG.src="alet edevat/Ani2.png"
                break;
            case 2:
                hataIMG.src="alet edevat/Ani3.png"
                break;
            case 3:
                hataIMG.src="alet edevat/Ani4.png"
                break;
            case 4:
                hataIMG.src="alet edevat/Ani5.png"
                break;
            case 5:
                hataIMG.src="alet edevat/Ani6.png"
                break;
        }
       
        
    }
    
})

document.getElementById("E").addEventListener("click", function() {

    if (rastgele3 == 5) 
    {
        // console.log("Doğru Cevap")
        score = score + 10
        skor.innerHTML = "Skor: " + score
        firebase.database().ref("Kullanicilar").child(oyuncuid).once("value", (snapshot)=>{
            var data=snapshot.val()
            var puan=data.skor+10
            firebase.database().ref("Kullanicilar").child(oyuncuid).update({
                skor: puan
            })
        })
        switch (oyunmodu) {
            case '?secenek=1':
                // console.log("TR")
                oyunDongusuTR()
                break;
            case '?secenek=2':
                // console.log("en")
                oyunDongusuEN()
                break;
            case '?secenek=3':
                // console.log("mix")
                oyunDongusuMIX()
                break;
        
            default:
                // console.log("mix")
                oyunDongusuMIX()
                break;
        }
    }
    else
    {
        // console.log("Yanlış Cevap")
        yanlissayaci++
        if(yanlissayaci==6)
        {
            hataIMG.src="alet edevat/Ani7.png"
            // oyun bitti (tekrar dene ve çıkış butonu eğer fantezi istiyorsan kaç doğru falan filan.)
            bitisdivi.style.display="block"
            skorP.innerHTML=score
            A.disabled="disabled"
            B.disabled="disabled"
            C.disabled="disabled"
            D.disabled="disabled"
            E.disabled="disabled"


        }
        switch (yanlissayaci) {
            case 1:
                hataIMG.src="alet edevat/Ani2.png"
                break;
            case 2:
                hataIMG.src="alet edevat/Ani3.png"
                break;
            case 3:
                hataIMG.src="alet edevat/Ani4.png"
                break;
            case 4:
                hataIMG.src="alet edevat/Ani5.png"
                break;
            case 5:
                hataIMG.src="alet edevat/Ani6.png"
                break;
        }
       
        
    }
    
})
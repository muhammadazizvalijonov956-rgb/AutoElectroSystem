// ================= FIREBASE =================
firebase.initializeApp({
  apiKey: "AIzaSyCDbOvEFvs1eOiYFrO7r2DGFmcQzSQG4i4",
  projectId: "avtomobillarelektrtizimlari"
});
const db = firebase.firestore();

// ================= GLOBAL =================
let sent = false;

// ================= TEST ID =================
const testId = new URLSearchParams(location.search).get("test");
if (!testId) {
  document.body.innerHTML = "<div class='center'>❌ Test topilmadi</div>";
  throw new Error("NO_TEST_ID");
}

// ================= LOCAL LOCK CHECK =================
const localLockKey = `submitted_${testId}`;
const lockedUser = localStorage.getItem(localLockKey);
if (lockedUser) {
  lockScreen(lockedUser);
  throw new Error("LOCKED_LOCAL");
}

// ================= CHECK FIRESTORE =================
async function checkAlreadySubmitted(email) {
  const docId = `${testId}_${email}`;
  const ref = db.collection("results").doc(docId);
  const snap = await ref.get();

  if (snap.exists) {
    localStorage.setItem(localLockKey, snap.data().name + " " + snap.data().surname);
    lockScreen(snap.data().name + " " + snap.data().surname);
    throw new Error("LOCKED_FIRESTORE");
  }
}

// 🔒 CHECK WHEN EMAIL ENTERED
document.getElementById("email").addEventListener("blur", async () => {
  const email = document.getElementById("email").value.trim();
  if (email.includes("@")) {
    await checkAlreadySubmitted(email);
  }
});

// 🧠 TEST DATABASE
const TESTS = {
  batareyalari_1:{
    title:"Akkumulyator batareyalari testi",
    pass:60,
    questions:[
      [
        "Generator ishga tushishi uchun qaysi omillar kerak bo'ladi? Ularning ahamiyatini tushuntiring?",
        ["Kuchlanish, tok va magnit maydon",1],
        ["Faza burchagi, tok va rotor aylanish tezligi",0],
        ["Tok, magnit maydon va qobiq materiali",0]
      ],
      [
        "Kuchlanish hosil qiluvchi generatorning asosiy elementlarini sanab bering va ularning vazifalarini tushuntiring?",
        ["Kollektor, shkiv, kontakt halqalar",0],
        ["Kollektor, rotor, stator",1],
        ["Kollektor, rotator, akkumulyator",0]
      ],
      [
        "Kuchlanish regulyatorlari qanday turlarga bo'linadi va ularning ishlash prinsipi qanday?",
        ["Mexanik va elektromexanik, kuchlanishni pasaytiradi",0],
        ["Elektromexanik, elektron va raqamli, kuchlanishni oshiradi",0],
        ["Mexanik, elektro-mexanik, avtomatik, kuchlanishni nazorat qiladi",1]
      ],
      [
        "Elektromexanik kuchlanish regulyatorlarining afzalliklari va kamchiliklarini tahlil qiling",
        ["Yuqori samaradorlik, kam xizmat muddati",0],
        ["Oson boshqariladigan, yuqori narx",0],
        ["Oson o'rnatish, past samaradorlik",0],
        ["Tez ishlash, xizmat talab etadi",1]
      ],
      [
        "Akkumulyator batareyasining asosiy vazifasini izohlang.",
        ["Dvigatelni tez ishlatish",0],
        ["Dvigatelni ishga tushirish va barcha elektr tizimlarini ta'minlash",1],
        ["Energiya uzatishni boshlash",0]
      ],
      [
        "Startor rejimi va tok iste'molining minimal va maksimal qiymatlari?",
        ["250A minimal, 1000A maksimal",1],
        ["12V minimal, 250A maksimal",0],
        ["1000A minimal, 250A maksimal",0]
      ],
      [
        "Qo'rg'oshin-kislotali va ishqorli akkumulyatorlar farqi?",
        ["Qo'rg'oshin-kislotali uzoq xizmat qiladi",0],
        ["Qo'rg'oshin-kislotali kam, ishqorli ko‘proq xizmat qiladi",1],
        ["Ishqorli eng samarali",0]
      ],
      [
        "Qo'rg'oshin-kislotali akkumulyator tuzilishi?",
        ["Yaxlit qobiq, plastinalar, aktiv massa, separatorlar",1],
        ["Separator, plastinalar, qobiq, torf",0],
        ["Plastik qobiq, magnet",0]
      ],
      [
        "Plastinalar tarkibi?",
        ["Musbat – qo'rg'oshin surigi, manfiy – qo'rg'oshin oksidi",1],
        ["Mis va mis oksidi",0],
        ["Polimer va boshqa metall",0]
      ],
      [
        "Zamonaviy akkumulyator turlari?",
        ["Oddiy, Kam xizmat ko'rsatiladigan, Xizmat ko'rsatilmaydigan",1],
        ["Oddiy, Kompaniyaviy",0],
        ["Elektrolitsiz",0]
      ]
    ]
  },
  konstruksiyasi_1: {
  title: "Starter akkumulyatorlari testi",
  pass: 60,
  questions: [
    [
      "Starter akkumulyator batareyalarining asosiy energiya manbai sifatida xizmat qilishda qanday o'ziga xos talablari mavjud?",
      ["Ichki qarshilikning yuqori bo'lishi", 0],
      ["Katta razryad toklariga chidamlilik va kichik ichki qarshilik", 1],
      ["Elektr yurituvchi kuchning yuqori bo'lishi", 0]
    ],
    [
      "Qo'rg'oshin-kislotali akkumulyatorlarning asosiy afzalliklari nimalardan iborat?",
      ["Mexanik mustahkamligi yuqori", 0],
      ["Ichki qarshiligi kichik, startor rejimiga mos keladi", 1],
      ["Ishqorli akkumulyatorlarga nisbatan uzoq xizmat muddati", 0]
    ],
    [
      "Ishqorli akkumulyatorlarning afzalliklari qaysilar?",
      ["Mexanik mustahkamligi yuqori, xizmat muddati uzun", 1],
      ["Kamroq ishqorli komponentlarga ega", 0],
      ["Kichik startor rejimiga chidamliligi", 0]
    ],
    [
      "Qo'rg'oshin-kislotali akkumulyatorlarning tuzilishidagi asosiy elementlar nimalardan iborat?",
      ["Separatorlar, elektrod plastinalar, elektrolit", 1],
      ["Plastik qobiq, mis elektrodlar, g'ovak material", 0],
      ["Yaxlit qobiq, po'lat qopqoq, g'ovak plastina", 0]
    ],
    [
      "Akkumulyator plastinalarining aktiv massa tarkibi nima?",
      ["Musbat plastina: qo'rg'oshin oksidi va surma, manfiy plastina: qo'rg'oshin kukuni", 1],
      ["Musbat plastina: mis oksidi, manfiy plastina: torf", 0],
      ["Musbat plastina: mis, manfiy plastina: plastmassalar", 0]
    ],
    [
      "Separatorlarning asosiy vazifasi nima?",
      ["Akkumulyator elementlari orasidagi qisqa tutashuvlarni oldini olish", 1],
      ["Elektrolit sathini oshirish", 0],
      ["Startor rejimiga ko'proq energiya uzatish", 0]
    ],
    [
      "Ishqorli va qo'rg'oshin-kislotali akkumulyatorlarning farqi nima?",
      ["Ishqorli akkumulyatorlar uzoqroq xizmat qiladi, ammo yuqori ichki qarshilikka ega", 1],
      ["Qo'rg'oshin-kislotali akkumulyatorlar uzoqroq xizmat qiladi va kamroq gaz ajratadi", 0],
      ["Ishqorli akkumulyatorlar yuqori ichki qarshilikka ega va kamroq ishonchli", 0]
    ],
    [
      "“Kam xizmat ko'rsatiladigan” akkumulyator turi qanday xususiyatlarga ega?",
      ["Plastina tarkibidagi surma miqdori 2–2.5%", 1],
      ["Kam gaz ajralishi, yuqori xizmat muddati", 0],
      ["Maksimal razryad toki va kuchlanish", 0]
    ],
    [
      "“Xizmat ko'rsatilmaydigan” akkumulyatorlar qanday tuzilishga ega?",
      ["Qo'rg'oshin–kalsiy–qalay qotishmasidan tayyorlangan plastinalar", 1],
      ["Suv bilan to'ldirilgan akkumulyatorlar", 0],
      ["Plastik qobiq va kuchlanish regulyatori mavjud", 0]
    ],
    [
      "Akkumulyator batareyasiga texnik xizmat ko'rsatishda qanday ishlar bajariladi?",
      ["Elektrolit sathini tekshirish va to'ldirish, klemma va qutblarni tozalash", 1],
      ["Akkumulyatorning mexanik qismlarini almashtirish", 0],
      ["Barcha yuqoridagi ishlar bajarilmaydi", 0]
    ]
  ]
},
startor_akkum_1: {
  title: "Starter akkumulyator xususiyatlari testi",
  pass: 60,
  questions: [
    [
      "Starter akkumulyator batareyalari qanday xususiyatlarga ega?",
      ["Kichik ichki qarshilik, yuqori quvvat", 1],
      ["Katta mexanik mustahkamlik, past ichki qarshilik", 0],
      ["Keng tarqalgan, kam quvvat talab qiladi", 0]
    ],
    [
      "Qo'rg'oshin-kislotali akkumulyatorlarning afzalliklari nimalardan iborat?",
      ["Past ichki qarshilik, starter rejimiga mos keladi", 1],
      ["Uzoq xizmat muddati, yuqori mexanik mustahkamlik", 0],
      ["Narxi qimmat, maxsus sharoitlarda ishlatiladi", 0]
    ],
    [
      "Ishqoriy akkumulyatorlarning afzalliklari qaysilar?",
      ["Yuqori mexanik mustahkamlik, uzun xizmat muddati", 1],
      ["Kamroq ishlatiladi, yuqori energiya zichligi", 0],
      ["Uzoq muddatli zaryad olish, kam energiya yo'qotadi", 0]
    ],
    [
      "Starter akkumulyatorlaridagi elementlar soni necha bo'ladi?",
      ["6 ta", 1],
      ["8 ta", 0],
      ["10 ta", 0]
    ],
    [
      "Separatorlarning asosiy vazifasi nima?",
      ["Plastinalarning qisqa tutashuvini oldini olish", 1],
      ["Elektrolitni tez singdirish", 0],
      ["Akkumulyatorning zaryadini oshirish", 0]
    ],
    [
      "Qo'rg'oshin-kislotali akkumulyatorlarning tuzilishida nimalar mavjud?",
      ["Yaxlit qobiq, musbat va manfiy plastinalar, separatorlar", 1],
      ["Oddiy qobiq, metall plastinalar", 0],
      ["Yengil materiallardan tayyorlangan komponentlar", 0]
    ],
    [
      "Ishqoriy akkumulyatorlarning qo'llanilishi qayerda ko'proq uchraydi?",
      ["Avtomobillarda", 0],
      ["Ekstremal sharoitlarda (masalan, Arktika)", 1],
      ["Yengil avtomobillarda", 0]
    ],
    [
      "“Xizmat ko'rsatilmaydigan” akkumulyatorlarning xususiyatlari qanday?",
      ["Surma miqdori kam, gaz ajralishi past", 1],
      ["Kam xizmat ko'rsatiladigan, yuqori narx", 0],
      ["Xizmat ko'rsatiladigan, uzoq muddatli ishlash", 0]
    ],
    [
      "Separatorlarning turlari qanday farqlanadi?",
      ["Miplast separatorlar, qo'sh separatorlar", 1],
      ["Plastik va metal separatorlar", 0],
      ["Teflon va mis separatorlar", 0]
    ],
    [
      "Akkumulyator batareyalarini texnik xizmat ko'rsatishda nimalar bajariladi?",
      ["Elektrolit sathi tekshiriladi, klemma va qutblar tozalanadi", 1],
      ["Akkumulyator elementlari almashtiriladi", 0],
      ["Akkumulyator to'liq zaryadlanib yangi komponentlar o'rnatiladi", 0]
    ]
  ]
},
generator_qurilmalari_1: {
  title: "Generator qurilmalari testi",
  pass: 60,
  questions: [
    [
      "O'zgaruvchan tok generatorlarida nima sababdan tashqaridan tok berilishi kerak?",
      ["Generatorning yuqori energiya chiqishi", 0],
      ["O'z-o'zini uyg'otish xususiyatiga ega emas", 1],
      ["Generator kuchlanishining barqaror bo'lishi", 0]
    ],
    [
      "O'zgaruvchan tok generatorlarining asosiy kamchiligi nima?",
      ["Ishlatishda yuqori samaradorlik", 0],
      ["Chidamlilik va ishonchlilik", 0],
      ["O'z-o'zini uyg'otmasligi", 1]
    ],
    [
      "O'zgaruvchan tok generatorining yuqori samaradorligini qanday ta'minlash mumkin?",
      ["Teskari tokni yo'qotish", 0],
      ["Uyg'otish chulg'amiga to'g'ridan tok berish", 1],
      ["Kollektor va halqalarni almashtirish", 0]
    ],
    [
      "O'zgaruvchan tok generatorlarida qanday sxema ishlatiladi?",
      ["Yulduz sxemasi", 1],
      ["Yengil sxema", 0],
      ["To'g'rilagich sxemasi", 0]
    ],
    [
      "To'g'rilagich sxemasi qanday ishlaydi?",
      ["Pulsasiyani oshiradi", 0],
      ["Diodlar ikki guruhga bo'linib tokni to'g'rilaydi", 1],
      ["Generatorni avtomatik o'zgartiradi", 0]
    ],
    [
      "Pulsasiyalanish chastotasi nechaga teng?",
      ["50 pulsasiya", 0],
      ["6 pulsasiya", 1],
      ["150 pulsasiya", 0]
    ],
    [
      "Generator kuchlanishi qanday o'zgaradi?",
      ["Tez va samarali ish qiymatiga erishadi", 1],
      ["Qisqa vaqt ichida o'zgaradi", 0],
      ["Uzoq vaqt davomida o'zgaradi", 0]
    ],
    [
      "“Yulduz” sxemasi uchun qaysi munosabat to'g'ri?",
      ["Uch = √3 Uf, Ich = If", 1],
      ["Uch = Uf, Ich = √3 If", 0],
      ["Uch = √3 If, Ich = Uf", 0]
    ],
    [
      "O'zgaruvchan tok generatorining asosiy afzalligi?",
      ["Tez ishga tushish", 1],
      ["Kollektor mavjudligi", 0],
      ["Stator chulg'ami murakkabligi", 0]
    ],
    [
      "Pulsasiyalanishning minimal va maksimal qiymati?",
      ["1.5 Uf – 1.73 Uf", 1],
      ["2 Uf – 3 Uf", 0],
      ["1 Uf – 2 Uf", 0]
    ]
  ]
},
kuchlanish_rostlagichlari_1: {
  title: "Kuchlanish rostlagichlari testi",
  pass: 60,
  questions: [
    [
      "Kuchlanish rostlagichining asosiy vazifasi nima?",
      ["Generator kuchlanishini belgilangan darajada saqlash", 1],
      ["Akkumulyatorni to'liq zaryadlash", 0],
      ["Quvvatni oshirish", 0]
    ],
    [
      "Rostlagichning funksional sxemasi qanday ishlaydi?",
      ["O'lchov va taqqoslash orqali", 1],
      ["Generatorni avtomatik ishga tushiradi", 0],
      ["Faqat tokni o'lchaydi", 0]
    ],
    [
      "Rostlagichning matematik ifodasi nimaga asoslanadi?",
      ["Prujina kuchini o'zgartirishga", 1],
      ["Yakorcha tirqishini o'zgartirishga", 0],
      ["Kontakt joylashuviga", 0]
    ],
    [
      "Elektromagnit rostlagichlar qaysi generator bilan ishlaydi?",
      ["O'zgarmas tok generatorlari", 1],
      ["O'zgaruvchan tok generatorlari", 0],
      ["Ikki fazali generatorlar", 0]
    ],
    [
      "Rostlagichning asosiy elementlari?",
      ["O'lchov, taqqoslash, rostlash elementlari", 1],
      ["Diodlar va kontaktlar", 0],
      ["Generator va batareya", 0]
    ],
    [
      "Elektromagnit rostlagich afzalligi?",
      ["Oson xizmat, yuqori ishonchlilik", 1],
      ["Yuqori narx", 0],
      ["Mexanik murakkablik", 0]
    ],
    [
      "Rostlagichlar qaysi kriteriya asosida tasniflanadi?",
      ["Uyg'otish uslubiga qarab", 1],
      ["Fazalar soniga qarab", 0],
      ["Mexanik kuchga qarab", 0]
    ],
    [
      "Kuchlanish rostlagichlarining turlari?",
      ["Mexanik, elektromagnit, yarim o'tkazgichli", 1],
      ["Analog va raqamli", 0],
      ["Ikki fazali", 0]
    ],
    [
      "Kontakt yeyilishini oldini olish uchun nima qilinadi?",
      ["Prujina kuchi oshiriladi", 1],
      ["Diodlar almashtiriladi", 0],
      ["Qarshilik kamaytiriladi", 0]
    ],
    [
      "Temperatura oshishi kuchlanishga qanday ta'sir qiladi?",
      ["Kuchlanishni kamaytiradi", 1],
      ["Kuchlanishni oshiradi", 0],
      ["Ta'sir qilmaydi", 0]
    ]
  ]
},
diagnostika_1: {
  title: "Elektr ta’minoti tizimi diagnostikasi",
  pass: 60,
  questions: [
    [
      "Nosozliklarni aniqlashda nima muhim?",
      ["Nosozlikni aniqlash va xizmat ko'rsatish", 1],
      ["Yangi tizim o'rnatish", 0],
      ["Akkumulyatorni almashtirish", 0]
    ],
    [
      "Elektr ta'minoti tizimining asosiy komponenti?",
      ["Generator", 1],
      ["Kompyuter tizimi", 0],
      ["Elektron qismlar", 0]
    ],
    [
      "Generator ishga tushishi uchun nima kerak?",
      ["Aylanish tezligi va quvvat moslamalari", 1],
      ["To'g'ridan tok", 0],
      ["Regulyator faolligi", 0]
    ],
    [
      "Kuchlanish regulyatori turlari?",
      ["Elektromexanik, yarim o'tkazgichli, kontaktsiz", 1],
      ["Mexanik va elektr", 0],
      ["Yalpi va dinamik", 0]
    ],
    [
      "Plastinalar qanday metalldan?",
      ["Qo'rg'oshin", 1],
      ["Temir", 0],
      ["Mis", 0]
    ],
    [
      "Nosozlik tahlilida qaysi usul qo'llaniladi?",
      ["Multimetr bilan o'lchash", 1],
      ["Vizual almashtirish", 0],
      ["Akkumulyatorni yangilash", 0]
    ],
    [
      "Generatorning eng sodda nosozligi?",
      ["Kontakt buzilishi", 1],
      ["Regulyator ishdan chiqishi", 0],
      ["Batareya zaryadsizlanishi", 0]
    ],
    [
      "Yarim o'tkazgichli rostlagich afzalligi?",
      ["Uzoq xizmat, yuqori ishonchlilik", 1],
      ["Qisqa ishlash muddati", 0],
      ["Murakkab sozlash", 0]
    ],
    [
      "Kontakt-tranzistorli rostlagich prinsipi?",
      ["Kontakt o'chib tranzistor ochiladi", 1],
      ["Tranzistor generatorni boshqaradi", 0],
      ["Uyg'otish toki uzatiladi", 0]
    ],
    [
      "Zamonaviy rostlagich afzalligi?",
      ["Kontaktsiz, samarali, uzoq xizmat", 1],
      ["Faqat moslashuvchanlik", 0],
      ["Oson almashtirish", 0]
    ]
  ]
},
starter_tizimi_1: {
  title: "Elektrdan ishga tushirish tizimi",
  pass: 60,
  questions: [
    [
      "Ishga tushirish tizimi qaysi komponentlardan iborat?",
      ["Starter va akkumulyator batareyasi", 1],
      ["Starter va o'tkazgichlar", 0],
      ["Akkumulyator va dvigatel", 0]
    ],
    [
      "Starterning asosiy vazifasi?",
      ["Dvigatelni tez ishga tushirish", 1],
      ["Tizimni boshqarish", 0],
      ["Zaryadlash", 0]
    ],
    [
      "Startorning ishlash prinsipi?",
      ["Elektromagnit tortish va ilashish", 1],
      ["Elektron boshqaruv", 0],
      ["Mexanik uzatma", 0]
    ],
    [
      "Starter quvvati nimaga bog'liq?",
      ["Dvigatel qarshilik momentiga", 1],
      ["Haroratga", 0],
      ["Kuchlanishga", 0]
    ],
    [
      "Yengillatuvchi moslamalar vazifasi?",
      ["Sovuqda ishga tushirishni osonlashtiradi", 1],
      ["Zaryadlaydi", 0],
      ["Starterga yordam bermaydi", 0]
    ],
    [
      "Benzinli dvigatelning ishga tushirish chastotasi?",
      ["40–60 min⁻¹", 1],
      ["10–20 min⁻¹", 0],
      ["100–120 min⁻¹", 0]
    ],
    [
      "Dvigatel ishga tushgach starter?",
      ["Avtomatik ajraladi", 1],
      ["Ishda qoladi", 0],
      ["Kontakt uzadi", 0]
    ],
    [
      "Qaysi starter kam yuk beradi?",
      ["Doimiy magnitli", 1],
      ["Reduktorsiz", 0],
      ["Katta quvvatli", 0]
    ],
    [
      "Qarshilik momenti nimaga bog'liq?",
      ["Ishqalanish va siqilish", 1],
      ["Tok turiga", 0],
      ["Batareya quvvatiga", 0]
    ],
    [
      "Yengillashtiruvchi vositalar qaysi dvigatel uchun?",
      ["Dizel dvigatel", 1],
      ["Benzinli", 0],
      ["Har ikkisi", 0]
    ]
  ]
},
ot_oldirish_1: {
  title: "O‘t oldirish tizimi testi",
  pass: 60,
  questions: [
    [
      "O‘t oldirish tizimi qanday uskunalardan tashkil topgan?",
      ["Starter, uzgich-taqsimlagich, batareya, shamlar", 1],
      ["Elektron boshqaruv va kondensator", 0],
      ["Silindr va alternator", 0]
    ],
    [
      "Uzgich-taqsimlagich vazifasi?",
      ["Yuqori kuchlanishni shamlariga yetkazish", 1],
      ["Past kuchlanishni boshqarish", 0],
      ["Zaryadlash", 0]
    ],
    [
      "Starterning vazifasi?",
      ["Dvigatelni tez ishga tushirish", 1],
      ["Elektron boshqaruv", 0],
      ["Energiya ta'minoti", 0]
    ],
    [
      "Dvigatel ishga tushgach starter?",
      ["Avtomatik ajraladi", 1],
      ["Ishda qoladi", 0],
      ["Boshqa tizimni boshqaradi", 0]
    ],
    [
      "Elektron o‘t oldirishga o‘tish sababi?",
      ["Ishonchlilik va samaradorlik", 1],
      ["Quvvatni oshirish", 0],
      ["Shamlarni yaxshilash", 0]
    ],
    [
      "Elektron o‘t oldirish afzalligi?",
      ["Tez ishga tushish va aniq boshqaruv", 1],
      ["Past quvvat", 0],
      ["Uchqunni ko‘paytirish", 0]
    ],
    [
      "O‘t oldirish tizimidagi nosozlik?",
      ["Shamlar eskirishi", 1],
      ["Starter kuchlanishi", 0],
      ["Alternator", 0]
    ],
    [
      "Kommutator ishdan chiqish sababi?",
      ["Material yemirilishi", 1],
      ["Kontaktsiz tizim", 0],
      ["Tok uzilishi", 0]
    ],
    [
      "Ishga tushirish kuchlanishi?",
      ["Yuqori kuchlanish zaxirasi bilan", 1],
      ["O‘rtacha", 0],
      ["Yangi energiya", 0]
    ],
    [
      "O‘t oldirish tizimi muammosi?",
      ["Buzilgan starterlar", 1],
      ["Past kuchlanish tizimi", 0],
      ["Yuqori tezlik", 0]
    ]
  ]
},
avto_elektr_diagnostika_1: {
  title: "Avtomobil elektr tizimlari va diagnostika",
  pass: 60,
  questions: [
    [
      "Avtomobil elektr tizimlarining asosiy komponentlari qaysilar?",
      ["Batareya, alternator, starter, boshqaruv modullari", 1],
      ["Kompaniyalar, akkumulyatorlar, diodlar", 0],
      ["Elektr simlari, rezistorlar, kondensatorlar", 0]
    ],
    [
      "OBD-II tizimi nima uchun ishlatiladi?",
      ["Batareyani tez zaryadlash uchun", 0],
      ["Kompyuter tizimlarini tekshirish va diagnostika qilish", 1],
      ["Yangi tizimlarni o‘rnatish uchun", 0]
    ],
    [
      "Diagnostika skanerlari yordamida qaysi tizimlarni tekshirish mumkin?",
      ["Faqat motor tizimini", 0],
      ["Yangi xatoliklarni tekshirish", 0],
      ["Yuqori kuchlanish tizimi, inverter, elektr motorlar va zaryadlash tizimi", 1]
    ],
    [
      "Elektr tizimlarida qanday nosozliklar uchraydi?",
      ["Yangi dizaynlar va strukturalar", 0],
      ["Batareya zaryadining yo‘qolishi, alternator nosozliklari", 1],
      ["Yangi motorlar o‘rnatilishi", 0]
    ],
    [
      "Intermittent nosozliklar qanday aniqlanadi?",
      ["Shovqin chiqaruvchi vositalar bilan", 0],
      ["Uzoq muddatli kuzatish va ma'lumot yozish orqali", 1],
      ["Faol test orqali", 0]
    ],
    [
      "Multimetr yordamida qaysi o‘lchovlar amalga oshiriladi?",
      ["Faqat kuchlanish", 0],
      ["Uzluksizlik, kuchlanish va tok", 1],
      ["Faqat tok", 0]
    ],
    [
      "Diagnostika jarayonida xavfsizlikni nima ta’minlaydi?",
      ["Faqat qo‘lqop va ko‘zoynak", 0],
      ["Izolyatsiyalangan asboblar va himoya kiyimlari", 1],
      ["Faqat izolyatsiya lentasi", 0]
    ],
    [
      "BMS diagnostikasi nima uchun muhim?",
      ["Harorat sensorlarini tekshirish uchun", 0],
      ["Batareya hujayralarining holatini nazorat qilish uchun", 1],
      ["Simlarni tekshirish uchun", 0]
    ],
    [
      "Nosozliklarni bartaraf etishda qaysi vositalar ishlatiladi?",
      ["Faqat boshqaruv modullari", 0],
      ["Lehimlash payvandi, elektr lentasi, maxsus konnektorlar", 1],
      ["Yangi simlar o‘rnatish", 0]
    ],
    [
      "Xato kodlarni qanday talqin qilish kerak?",
      ["Faqat umumiy xatolarni tanish", 0],
      ["Chuqur tahlil va qo‘shimcha testlar bilan", 1],
      ["Xatolarni e’tiborga olmaslik", 0]
    ]
  ]
},
ot_oldirish_shamlari_1: {
  title: "O‘t oldirish shamlari",
  pass: 60,
  questions: [
    [
      "O‘t oldirish shamlari qanday vazifani bajaradi?",
      ["Dvigatelni sovutish", 0],
      ["Ishchi aralashmani o‘t oldirish", 1],
      ["Dvigatelni zaryadlash", 0]
    ],
    [
      "O‘t oldirish shamlari qanday kuchlanish bilan ishlaydi?",
      ["12000–24000V", 1],
      ["1000–5000V", 0],
      ["5–10V", 0]
    ],
    [
      "Sham korroziyasi nima sababdan yuzaga keladi?",
      ["Tizim ishlamasligi", 0],
      ["Agressiv moddalar va yonilg‘i yonishi", 1],
      ["Dvigatel quvvatining oshishi", 0]
    ],
    [
      "O‘t oldirish shamlari qaysi materialdan tayyorlanadi?",
      ["Titan qotishmasi", 0],
      ["Aluminiy oksidi (Al₂O₃)", 1],
      ["Temir oksidi", 0]
    ],
    [
      "“Issiq” shamlar qaysi dvigatellarga o‘rnatiladi?",
      ["Yuqori siqishli dvigatellarga", 0],
      ["Siqish darajasi past dvigatellarga", 1],
      ["Og‘ir issiqlik rejimiga", 0]
    ],
    [
      "“Sovuq” shamlar qaysi dvigatellarga mos?",
      ["Past aylanishli dvigatellarga", 0],
      ["Siqish darajasi va quvvati katta dvigatellarga", 1],
      ["Issiqlik rejimi og‘ir dvigatellarga", 0]
    ],
    [
      "Markaziy elektrod qanday xususiyatlarga ega bo‘lishi kerak?",
      ["Korroziyaga chidamli va issiqlikka bardoshli", 1],
      ["Energiya saqlovchi", 0],
      ["Kam issiqlik o‘tkazuvchi", 0]
    ],
    [
      "Platinadan tayyorlangan shamlar afzalligi?",
      ["Kam energiya sarfi", 0],
      ["Uzoq xizmat muddati va ishonchlilik", 1],
      ["Arzon ishlab chiqarish", 0]
    ],
    [
      "O‘t oldirish shamlari qachon almashtiriladi?",
      ["Har 5 000 km", 0],
      ["20–30 000 km yurganda", 1],
      ["Faqat ta’mirdan keyin", 0]
    ],
    [
      "Izolyator konusining temperaturasi qanday bo‘lishi kerak?",
      ["300–500°C", 0],
      ["400–900°C", 1],
      ["1000–1200°C", 0]
    ]
  ]
},
ot_oldirish_tizimi_2: {
  title: "O‘t oldirish tizimi",
  pass: 60,
  questions: [
    [
      "O‘t oldirish tizimi qanday uskunalardan tashkil topgan?",
      ["Starter, uzgich-taqsimlagich, batareya, o‘t oldirish shamlari", 1],
      ["Elektron boshqaruv va kondensator", 0],
      ["Silindr, batareya, alternator", 0]
    ],
    [
      "Uzgich-taqsimlagichning asosiy vazifasi nima?",
      ["Past kuchlanish tizimini boshqarish", 0],
      ["Yuqori kuchlanish impulslarini shamlariga yetkazish", 1],
      ["Batareyani zaryadlash", 0]
    ],
    [
      "Starterning asosiy vazifasi nima?",
      ["Dvigatelni tezda ishga tushirish", 1],
      ["Elektron tizimlarni boshqarish", 0],
      ["Energiya bilan ta’minlash", 0]
    ],
    [
      "Dvigatel ishga tushgandan keyin starter nima qiladi?",
      ["Avtomatik ajraladi", 1],
      ["Ishlashda davom etadi", 0],
      ["Boshqa tizimlarni boshqaradi", 0]
    ],
    [
      "Nima sababdan elektron o‘t oldirish tizimiga o‘tilgan?",
      ["Quvvatni oshirish uchun", 0],
      ["Ishonchlilik va samaradorlikni oshirish uchun", 1],
      ["Shamlar sifatini yaxshilash uchun", 0]
    ],
    [
      "Elektron o‘t oldirish tizimining afzalligi?",
      ["Tez ishga tushish va aniq boshqaruv", 1],
      ["Past quvvatda ishlash", 0],
      ["Uchqunni ko‘paytirish", 0]
    ],
    [
      "O‘t oldirish tizimidagi keng tarqalgan nosozlik?",
      ["Shamlarning eskirishi", 1],
      ["Starter kuchlanishi", 0],
      ["Alternator ishga tushishi", 0]
    ],
    [
      "Kommutatorning ishdan chiqish sababi?",
      ["Material yemirilishi va vaqtinchalik ishlash", 1],
      ["Kontaktsiz tizim ishlamasligi", 0],
      ["Tok uzilishi", 0]
    ],
    [
      "O‘t oldirish tizimining ishga tushirish kuchlanishi qanday?",
      ["O‘rtacha", 0],
      ["Yuqori kuchlanish zaxirasi bilan", 1],
      ["Yangi energiya bilan", 0]
    ],
    [
      "O‘t oldirish tizimida qanday muammo yuzaga keladi?",
      ["Buzilgan starterlar", 1],
      ["Past kuchlanish tizimlari", 0],
      ["Yuqori tezlikdagi dvigatellar", 0]
    ]
  ]
}
};

// ================= LOAD TEST =================
const test = TESTS[testId];
document.getElementById("title").textContent = test.title;

const qBox = document.getElementById("questions");
test.questions.forEach((q, i) => {
  qBox.innerHTML += `
    <div class="question">
      <p>${i + 1}. ${q[0]}</p>
      ${q.slice(1).map(o => `
        <label class="option">
          <input type="radio" name="q${i}" value="${o[1]}"> ${o[0]}
        </label>
      `).join("")}
    </div>`;
});

// ================= TIMER =================
let time = 15 * 60;
const timer = setInterval(() => {
  const m = Math.floor(time / 60);
  const s = time % 60;
  document.getElementById("timer").textContent =
    `⏱ ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  time--;
  if (time < 0) {
    clearInterval(timer);
    submit(true);
  }
}, 1000);

// ================= SUBMIT =================
document.getElementById("submitBtn").onclick = () => submit(false);

async function submit(auto = false) {
  if (sent) return;
  sent = true;

  const name = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!auto && (!name || !surname || !email || !email.includes("@"))) {
    alert("Ma’lumotlarni to‘liq kiriting");
    sent = false;
    return;
  }

  await checkAlreadySubmitted(email); // 🔒 FINAL SAFETY CHECK

  let score = 0;
  document.querySelectorAll("input[type=radio]:checked")
    .forEach(i => score += Number(i.value));

  const total = test.questions.length;
  const percent = Math.round((score / total) * 100);
  const passed = percent >= test.pass;

  document.getElementById("result").textContent =
    `Natija: ${percent}% — ${passed ? "O‘TDINGIZ" : "YIQILDINGIZ"}`;

  clearInterval(timer);

  const docId = `${testId}_${email}`;
  const ref = db.collection("results").doc(docId);

  await ref.set({
    name,
    surname,
    email,
    testId,
    score,
    total,
    percent,
    passed,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  // 🔒 HARD LOCK
  localStorage.setItem(localLockKey, name + " " + surname);

  alert("✅ Test yuborildi!");
  lockScreen(name + " " + surname);
}

// ================= LOCK SCREEN =================
function lockScreen(studentName) {
  document.body.innerHTML = `
    <div class="center">
      <div style="text-align:center">
        <h2>❌ Bu test allaqachon topshirilgan</h2>
        <p style="color:#ffd24d">👤 ${studentName}</p>
        <button class="submit-btn" onclick="location.href='maruza.html'">
          🔙 Orqaga
        </button>
      </div>
    </div>
  `;
}

// ===============================
// DEFAULT SETTINGS
// ===============================
let JAKIM_ZONE = localStorage.getItem("zone") || "WLY01";
let CITY = localStorage.getItem("city") || "Kuala Lumpur";

const STATE_MAP = {
  "WLY01": "Kuala Lumpur",
  "JHR01": "Johor",
  "KDH01": "Kedah",
  "KTN01": "Kelantan",
  "MLK01": "Melaka",
  "NSN01": "Negeri Sembilan",
  "PHG01": "Pahang",
  "PNG01": "Pulau Pinang",
  "PRK01": "Perak",
  "PLS01": "Perlis",
  "SBH01": "Sabah",
  "SWK01": "Sarawak",
  "SGR01": "Selangor",
  "TRG01": "Terengganu"
};

// 👉 Tukar API KEY ni dgn key OpenWeather Neolanz
const WEATHER_API_KEY = "ef8071d4d83f5a4dfbef9175c688e03c";

// ===============================
// SET DEFAULT DROPDOWN VALUE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("stateSelect");

  select.value = JAKIM_ZONE;

  select.addEventListener("change", () => {
    JAKIM_ZONE = select.value;
    CITY = STATE_MAP[JAKIM_ZONE];

    // Simpan dalam localStorage
    localStorage.setItem("zone", JAKIM_ZONE);
    localStorage.setItem("city", CITY);

    // Reload API
    loadWaktuSolat();
    loadCuaca();
  });

  loadWaktuSolat();
  loadCuaca();
  updateVisitor();
});

// ===============================
// WAKTU SOLAT - JAKIM
// ===============================
async function loadWaktuSolat() {
  try {
    const response = await fetch(
      `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=${JAKIM_ZONE}`
    );

    const data = await response.json();
    const waktu = data.prayerTime[0];

    document.getElementById("solatBox").innerHTML = `
      🕌 Subuh: ${waktu.fajr} | 
      Zohor: ${waktu.dhuhr} | 
      Asar: ${waktu.asr} | 
      Maghrib: ${waktu.maghrib} | 
      Isyak: ${waktu.isha}
    `;
  } catch (error) {
    document.getElementById("solatBox").innerText = "Gagal load waktu solat";
    console.error("Solat error:", error);
  }
}

// ===============================
// CUACA - OPENWEATHER
// ===============================
async function loadCuaca() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY},MY&appid=${WEATHER_API_KEY}&units=metric`
    );

    const data = await response.json();

    const suhu = Math.round(data.main.temp);
    const cuaca = data.weather[0].description;

    document.getElementById("cuacaBox").innerHTML = `
      ☁️ ${CITY} | ${suhu}°C | ${cuaca}
    `;
  } catch (error) {
    document.getElementById("cuacaBox").innerText = "Gagal load cuaca";
    console.error("Cuaca error:", error);
  }
}

// ===============================
// VISITOR COUNTER (LOCAL)
// ===============================
function updateVisitor() {
  let visit = localStorage.getItem("visitCount") || 0;
  visit++;
  localStorage.setItem("visitCount", visit);
  document.getElementById("visitCount").innerText = visit;
}

// ===============================
// AUTO REFRESH EVERY 10 MIN
// ===============================
setInterval(() => {
  loadWaktuSolat();
  loadCuaca();
}, 600000);

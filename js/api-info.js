// ===============================
// CONFIG DEFAULT
// ===============================
const JAKIM_ZONE = "WLY01";   // KL & Putrajaya
const CITY = "Kuala Lumpur";
const COUNTRY = "MY";

// 👉 Tukar ni dgn API Key OpenWeather Neolanz
const WEATHER_API_KEY = "ef8071d4d83f5a4dfbef9175c688e03c";

// ===============================
// WAKTU SOLAT - JAKIM API
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
      Maghrib: ${waktu.maghrib}
    `;
  } catch (error) {
    document.getElementById("solatBox").innerText = "Gagal load waktu solat";
    console.error("Waktu solat error:", error);
  }
}

// ===============================
// CUACA API - OPENWEATHER
// ===============================
async function loadCuaca() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&appid=${WEATHER_API_KEY}&units=metric`
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
// COUNTER PENGUNJUNG (LOCAL)
// ===============================
let visit = localStorage.getItem("visitCount") || 0;
visit++;
localStorage.setItem("visitCount", visit);
document.getElementById("visitCount").innerText = visit;

// ===============================
// INIT LOAD
// ===============================
loadWaktuSolat();
loadCuaca();

// Refresh setiap 10 minit
setInterval(() => {
  loadWaktuSolat();
  loadCuaca();
}, 600000);

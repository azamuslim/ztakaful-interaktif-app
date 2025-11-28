// ========== CONFIG ==========
const negeri = "Penang";  // Tukar ikut negeri Neolanz
const lokasi = "George Town";

const openWeatherApiKey = "ISI_API_KEY_OPENWEATHER_KAU";

// ========== WAKTU SOLAT (API JAKIM / ALADHAN) ==========
async function loadWaktuSolat() {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings?city=${lokasi}&country=Malaysia&method=11`
    );
    const data = await response.json();

    const waktu = data.data.timings;

    document.getElementById("waktu-solat").innerHTML = `
      🕌 Subuh: ${waktu.Fajr} |
      Zohor: ${waktu.Dhuhr} |
      Asar: ${waktu.Asr} |
      Maghrib: ${waktu.Maghrib} |
      Isyak: ${waktu.Isha}
    `;
  } catch (error) {
    document.getElementById("waktu-solat").innerText =
      "🕌 Waktu Solat: Gagal load";
  }
}

// ========== CUACA (OPENWEATHER API) ==========
async function loadCuaca() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${lokasi},MY&units=metric&appid=${openWeatherApiKey}`
    );

    const data = await response.json();

    const suhu = data.main.temp;
    const cuaca = data.weather[0].description;

    document.getElementById("info-cuaca").innerHTML = `
      ☁️ ${lokasi} | ${suhu}°C | ${cuaca}
    `;
  } catch (error) {
    document.getElementById("info-cuaca").innerText =
      "☁️ Cuaca: Gagal load";
  }
}

// ========== LOAD ==========
loadWaktuSolat();
loadCuaca();

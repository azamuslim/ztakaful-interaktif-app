// -----------------------
// SETTINGS
// -----------------------
const workerSolat = "https://green-dust-cb98.azamuslim.workers.dev"; 
const stateDefault = "WLY01"; 
const coords = {
  "WLY01": { lat: 3.1390, lon: 101.6869 }, // KL
  "PNG01": { lat: 5.4141, lon: 100.3288 }, // Pulau Pinang
  "KDH01": { lat: 6.1184, lon: 100.3685 },
  "JHR01": { lat: 1.4927, lon: 103.7414 },
  "PHG01": { lat: 3.8126, lon: 103.3256 },
  "PRK01": { lat: 4.5975, lon: 101.0901 },
  "TRG01": { lat: 5.3302, lon: 103.1408 },
  "KEL01": { lat: 6.1254, lon: 102.2381 }
};

// -----------------------
// INIT
// -----------------------
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("selectedState") || stateDefault;
  document.getElementById("stateSelect").value = saved;

  updateAll(saved);

  document.getElementById("stateSelect").addEventListener("change", e => {
    localStorage.setItem("selectedState", e.target.value);
    updateAll(e.target.value);
  });

  updateVisitor();
});

// -----------------------
// UPDATE ALL
// -----------------------
function updateAll(stateCode) {
  loadSolat(stateCode);
  loadCuaca(stateCode);
}

// -----------------------
// WAKTU SOLAT (CLOUDFLARE WORKER)
// -----------------------
async function loadSolat(stateCode) {
  const box = document.getElementById("solatBox");
  box.textContent = "🕌 Memuatkan waktu solat...";

  try {
    const res = await fetch(`${workerSolat}?state=${stateCode}`);
    const data = await res.json();

    if (data.error) {
      box.textContent = "🕌 Gagal ambil data solat";
      return;
    }

    const w = data.prayer_times;
    box.textContent = `🕌 Subuh: ${w.fajr} | Zohor: ${w.dhuhr} | Asar: ${w.asr} | Maghrib: ${w.maghrib} | Isyak: ${w.isha}`;

  } catch (err) {
    box.textContent = "🕌 Ralat waktu solat";
  }
}

// -----------------------
// CUACA (OPEN-METEO)
// -----------------------
async function loadCuaca(stateCode) {
  const box = document.getElementById("cuacaBox");
  box.textContent = "☁️ Memuatkan cuaca...";

  try {
    const { lat, lon } = coords[stateCode] || coords[stateDefault];

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    const res = await fetch(url);
    const data = await res.json();

    const cu = data.current_weather;
    const suhu = cu.temperature;
    const angin = cu.windspeed;

    box.textContent = `☁️ Suhu: ${suhu}°C | Angin: ${angin} km/h`;

  } catch (err) {
    box.textContent = "☁️ Gagal muat cuaca";
  }
}

// -----------------------
// VISITOR COUNTER
// -----------------------
function updateVisitor() {
  let count = localStorage.getItem("visitors") || 0;
  count = parseInt(count) + 1;
  localStorage.setItem("visitors", count);
  document.getElementById("visitCount").textContent = count;
}

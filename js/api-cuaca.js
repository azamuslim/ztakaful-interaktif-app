document.addEventListener("DOMContentLoaded", () => {

  const cuacaBox = document.getElementById("cuacaBox");
  const stateSelect = document.getElementById("stateSelect");

  // ===============================
  // SENARAI COORDINATE MALAYSIA
  // ===============================
  const LOC = {
    "WLY01": { name: "Kuala Lumpur / Putrajaya", lat: 3.1390, lon: 101.6869 },
    "SGR01": { name: "Selangor", lat: 3.0738, lon: 101.5183 },
    "JHR01": { name: "Johor", lat: 1.4927, lon: 103.7414 },
    "KDH01": { name: "Kedah", lat: 6.1184, lon: 100.3685 },
    "KTN01": { name: "Kelantan", lat: 6.1254, lon: 102.2381 },
    "MLK01": { name: "Melaka", lat: 2.1896, lon: 102.2501 },
    "NSN01": { name: "Negeri Sembilan", lat: 2.7258, lon: 101.9378 },
    "PHG01": { name: "Pahang", lat: 3.8126, lon: 103.3256 },
    "PNG01": { name: "Pulau Pinang", lat: 5.4141, lon: 100.3288 },
    "PRK01": { name: "Perak", lat: 4.5975, lon: 101.0901 },
    "PLS01": { name: "Perlis", lat: 6.4449, lon: 100.2040 },
    "SBH01": { name: "Sabah", lat: 5.9788, lon: 116.0753 },
    "SWK01": { name: "Sarawak", lat: 1.5533, lon: 110.3592 },
    "TRG01": { name: "Terengganu", lat: 5.3290, lon: 103.1370 }
  };

  // DEFAULT ZONE
  let zone = localStorage.getItem("zone") || "WLY01";
  stateSelect.value = zone;

  // ===============================
  // KOD → TEKS CUACA (Open-Meteo)
  // ===============================
  function getWeatherDesc(code) {
    const map = {
      0: "Cerah",
      1: "Sedikit Berawan",
      2: "Berawan",
      3: "Mendung",
      45: "Kabut",
      48: "Kabut Tebal",
      51: "Hujan Renyai",
      61: "Hujan",
      63: "Hujan Lebat",
      65: "Hujan Sangat Lebat",
      71: "Salji",
      80: "Hujan Turun",
      81: "Hujan Sederhana",
      82: "Hujan Lebat"
    };
    return map[code] || "Cuaca Tidak Diketahui";
  }

  // ===============================
  // KOD → ICON FILE
  // ===============================
  function getWeatherIcon(code) {
    if (code === 0) return "icons/weather/clear.png";
    if (code === 1) return "icons/weather/partly-cloudy.png";
    if (code === 2) return "icons/weather/cloudy.png";
    if (code === 3) return "icons/weather/cloudy.png";

    if (code === 45 || code === 48) return "icons/weather/fog.png";

    if (code === 51) return "icons/weather/rain-light.png";
    if (code === 61 || code === 80 || code === 81) return "icons/weather/rain.png";
    if (code === 63 || code === 82 || code === 65) return "icons/weather/rain-heavy.png";

    if (code === 95 || code === 96 || code === 99) return "icons/weather/storm.png";

    if (code === 71) return "icons/weather/snow.png";

    return "icons/weather/partly-cloudy.png"; // fallback
  }

  // ===============================
  // LOAD CUACA
  // ===============================
  async function loadWeather() {
    const selected = LOC[zone];
    cuacaBox.innerHTML = "⏳ Loading cuaca...";

    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${selected.lat}` +
        `&longitude=${selected.lon}&current_weather=true`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.current_weather) {
        cuacaBox.innerHTML = "❌ Cuaca tidak tersedia";
        return;
      }

      const temp = Math.round(data.current_weather.temperature);
      const code = data.current_weather.weathercode;

      const desc = getWeatherDesc(code);
      const icon = getWeatherIcon(code);

      // PAPAR
      cuacaBox.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${icon}" width="55" />
          <div>
            <strong>${selected.name}</strong><br>
            ${temp}°C • ${desc}
          </div>
        </div>
      `;

    } catch (e) {
      cuacaBox.innerHTML = "❌ Cuaca Error";
      console.log(e);
    }
  }

  // CHANGE STATE
  stateSelect.addEventListener("change", () => {
    zone = stateSelect.value;
    localStorage.setItem("zone", zone);
    loadWeather();
  });

  // FIRST LOAD
  loadWeather();

  // REFRESH 10 MINIT
  setInterval(loadWeather, 600000);

});

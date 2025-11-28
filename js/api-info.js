document.addEventListener("DOMContentLoaded", () => {

  const solatBox = document.getElementById("solatBox");
  const cuacaBox = document.getElementById("cuacaBox");
  const visitCount = document.getElementById("visitCount");
  const stateSelect = document.getElementById("stateSelect");

  // =========================
  // DEFAULT LOCALSTORAGE
  // =========================
  let JAKIM_ZONE = localStorage.getItem("zone") || "WLY01";
  let CITY = localStorage.getItem("city") || "Kuala Lumpur";

  const STATE_MAP = {
    "WLY01": "Kuala Lumpur",
    "JHR01": "Johor Bahru",
    "KDH01": "Alor Setar",
    "KTN01": "Kota Bharu",
    "MLK01": "Melaka",
    "NSN01": "Seremban",
    "PHG01": "Kuantan",
    "PNG01": "George Town",
    "PRK01": "Ipoh",
    "PLS01": "Kangar",
    "SBH01": "Kota Kinabalu",
    "SWK01": "Kuching",
    "SGR01": "Shah Alam",
    "TRG01": "Kuala Terengganu"
  };

  // WEATHER API
  const WEATHER_API_KEY = "ef8071d4d83f5a4dfbef9175c688e03c";

  // =====================
  // SET SELECTED STATE
  // =====================
  if (stateSelect) {
    stateSelect.value = JAKIM_ZONE;

    stateSelect.addEventListener("change", () => {
      JAKIM_ZONE = stateSelect.value;
      CITY = STATE_MAP[JAKIM_ZONE];

      localStorage.setItem("zone", JAKIM_ZONE);
      localStorage.setItem("city", CITY);

      loadSolat();
      loadCuaca();
    });
  }

  // =====================
  // LOAD FUNCTIONS
  // =====================
  loadSolat();
  loadCuaca();
  updateVisitor();

  // =========================
  // WORKAROUND: JAKIM API
  // =========================
  async function loadSolat() {
    solatBox.innerHTML = "🕌 Loading waktu solat...";

    try {
      const proxy = "https://api.allorigins.win/raw?url=";

      const apiURL =
        `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=${JAKIM_ZONE}`;

      const response = await fetch(proxy + encodeURIComponent(apiURL));

      const data = await response.json();

      const w = data?.prayerTime?.[0];

      if (!w) {
        solatBox.innerHTML = "❌ Tidak dapat ambil waktu solat";
        return;
      }

      solatBox.innerHTML =
        `🕌 Subuh: ${w.fajr} | Zohor: ${w.dhuhr} | Asar: ${w.asr} | Maghrib: ${w.maghrib} | Isyak: ${w.isha}`;

    } catch (e) {
      solatBox.innerHTML = "❌ Waktu solat gagal dimuat";
      console.log("JAKIM error:", e);
    }
  }

  // =========================
  // WEATHER API
  // =========================
  async function loadCuaca() {
    cuacaBox.innerHTML = "☁️ Loading cuaca...";

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY},MY&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        cuacaBox.innerHTML = "❌ Cuaca tidak dijumpai";
        return;
      }

      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].description;

      cuacaBox.innerHTML = `☁️ ${CITY} | ${temp}°C | ${desc}`;

    } catch (e) {
      cuacaBox.innerHTML = "❌ Gagal ambil cuaca";
      console.log("Weather error:", e);
    }
  }

  // =========================
  // VISITOR COUNTER
  // =========================
  function updateVisitor() {
    let count = localStorage.getItem("visitCount") || 0;
    count++;
    localStorage.setItem("visitCount", count);
    visitCount.innerText = count;
  }

  // =========================
  // AUTO REFRESH 10 MIN
  // =========================
  setInterval(() => {
    loadSolat();
    loadCuaca();
  }, 600000);

});

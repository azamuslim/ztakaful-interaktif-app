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
  // =======================
// WAKTU SOLAT JAKIM (Fix User-Agent)
// =======================
async function loadSolat() {
  solatBox.innerText = "🕌 Loading waktu solat...";

  try {
    const response = await fetch(
      `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=${JAKIM_ZONE}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "User-Agent": "Mozilla/5.0", 
          "Accept": "application/json"
        }
      }
    );

    const data = await response.json();

    if (!data.prayerTime || !data.prayerTime[0]) {
      solatBox.innerText = "❌ Waktu solat tidak tersedia";
      return;
    }

    const w = data.prayerTime[0];

    solatBox.innerHTML = `
      🕌 Subuh: ${w.fajr} |
      Zohor: ${w.dhuhr} |
      Asar: ${w.asr} |
      Maghrib: ${w.maghrib} |
      Isyak: ${w.isha}
    `;

  } catch (err) {
    solatBox.innerText = "❌ API Solat Bermasalah";
    console.error("Solat Error:", err);
  }
}


 // =======================
// CUACA GUNA WORKER TANPA API KEY LEAK
// =======================
async function loadCuaca() {
  cuacaBox.innerText = " Loading cuaca...";

  try {
    const url = `https://green-dust-cb98.azamuslim.workers.dev/weather?city=${CITY}`;

    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (data.error) {
      cuacaBox.innerText = " Cuaca error";
      return;
    }

    const temp = Math.round(data.temp);
    const desc = data.description;

    cuacaBox.innerHTML = ` ${CITY} | ${temp}°C | ${desc}`;

  } catch (err) {
    cuacaBox.innerText = " API Cuaca Problem";
    console.error("Cuaca Error:", err);
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

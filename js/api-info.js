document.addEventListener("DOMContentLoaded", () => {

  const solatBox = document.getElementById("solatBox");
  const cuacaBox = document.getElementById("cuacaBox");
  const visitCount = document.getElementById("visitCount");
  const stateSelect = document.getElementById("stateSelect");

  // Default / LocalStorage
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

  const WEATHER_API_KEY = "MASUK_API_KEY_OPENWEATHER";  

  // Set dropdown value & event
  if(stateSelect){
    stateSelect.value = JAKIM_ZONE;

    stateSelect.addEventListener("change", () => {
      JAKIM_ZONE = stateSelect.value;
      CITY = STATE_MAP[JAKIM_ZONE];

      // save to localStorage
      localStorage.setItem("zone", JAKIM_ZONE);
      localStorage.setItem("city", CITY);

      loadSolat();
      loadCuaca();
    });
  }

  // INIT LOAD
  loadSolat();
  loadCuaca();
  updateVisitor();

  // =======================
  // WAKTU SOLAT JAKIM
  // =======================
  async function loadSolat() {
    solatBox.innerText = "🕌 Loading waktu solat...";
    try {
      const response = await fetch(
        `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=${JAKIM_ZONE}`,
        { cache: "no-store" }
      );
      const data = await response.json();

      if(!data.prayerTime || !data.prayerTime[0]){
        solatBox.innerText = "❌ Data solat tiada";
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
      solatBox.innerText = "❌ API Solat Problem";
      console.error(err);
    }
  }

  // =======================
  // CUACA OPENWEATHER
  // =======================
  async function loadCuaca() {
    cuacaBox.innerText = "☁️ Loading cuaca...";
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY},MY&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await res.json();

      if(data.cod !== 200){
        cuacaBox.innerText = "❌ Cuaca error";
        return;
      }

      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].description;

      cuacaBox.innerHTML = `☁️ ${CITY} | ${temp}°C | ${desc}`;
    } catch(err){
      cuacaBox.innerText = "❌ API Cuaca Problem";
      console.error(err);
    }
  }

  // =======================
  // VISITOR COUNTER
  // =======================
  function updateVisitor(){
    let count = localStorage.getItem("visitCount") || 0;
    count++;
    localStorage.setItem("visitCount", count);
    visitCount.innerText = count;
  }

  // AUTO REFRESH 10 min
  setInterval(() => {
    loadSolat();
    loadCuaca();
  }, 600000);

});

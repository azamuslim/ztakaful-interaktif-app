document.addEventListener("DOMContentLoaded", () => {

  const solatBox = document.getElementById("solatBox");
  const visitCount = document.getElementById("visitCount");
  const stateSelect = document.getElementById("stateSelect");

  let JAKIM_ZONE = localStorage.getItem("zone") || "WLY01";

  if (stateSelect) {
    stateSelect.value = JAKIM_ZONE;

    stateSelect.addEventListener("change", () => {
      JAKIM_ZONE = stateSelect.value;
      localStorage.setItem("zone", JAKIM_ZONE);
      loadSolat();
    });
  }

  loadSolat();
  updateVisitor();

  // =======================
  // WAKTU SOLAT (Cloudflare Worker)
  // =======================
  async function loadSolat() {
    solatBox.innerText = "🕌 Loading waktu solat...";

    try {
      const response = await fetch(
        `https://green-dust-cb98.azamuslim.workers.dev/solat?zone=${JAKIM_ZONE}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!data.prayerTime || !data.prayerTime[0]) {
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
      solatBox.innerText = "❌ API Solat Problem (Worker)";
      console.error("Solat Error:", err);
    }
  }

  // =======================
  // VISITOR COUNTER
  // =======================
  function updateVisitor() {
    let count = localStorage.getItem("visitCount") || 0;
    count++;
    localStorage.setItem("visitCount", count);
    visitCount.innerText = count;
  }

  // Auto refresh solat
  setInterval(loadSolat, 600000);

});

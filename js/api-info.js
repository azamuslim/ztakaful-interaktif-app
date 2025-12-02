// =================================================
// FINAL: API WAKTU SOLAT — CONFIRM WORKING
// =================================================

async function loadWaktuSolat(zone = "WLY01") {
    const box = document.getElementById("solatBox");
    box.innerHTML = "🕌 Memuatkan waktu solat...";

    try {
        const url = `https://api.waktusolat.app/v2/solat/${zone}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data?.prayer_times) {
            box.innerHTML = "❌ Gagal memuatkan waktu solat";
            return;
        }

        const w = data.prayer_times;

        box.innerHTML = `
            <strong>Waktu Solat</strong><br>
            Subuh: ${w.fajr}<br>
            Syuruk: ${w.syuruk}<br>
            Zohor: ${w.dhuhr}<br>
            Asar: ${w.asr}<br>
            Maghrib: ${w.maghrib}<br>
            Isyak: ${w.isha}
        `;
    } catch (err) {
        box.innerHTML = "❌ Waktu solat gagal dimuat";
    }
}


// =====================================================
// VISITOR COUNTER LOCALSTORAGE (NO ERROR)
// =====================================================
function loadVisitors() {
    let visits = localStorage.getItem("ztakaful_visits") || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem("ztakaful_visits", visits);

    document.getElementById("visitCount").innerHTML = visits;
}


// =============================
// PAGE LOAD
// =============================
document.addEventListener("DOMContentLoaded", () => {

    // Default zone KL
    loadWaktuSolat("WLY01");

    // Visitor Counter
    loadVisitors();

    // Dropdown Negeri
    const stateSel = document.getElementById("stateSelect");

    if (stateSel) {
        stateSel.addEventListener("change", () => {
            loadWaktuSolat(stateSel.value);
            localStorage.setItem("chosenState", stateSel.value);
        });

        const saved = localStorage.getItem("chosenState");
        if (saved) {
            stateSel.value = saved;
            loadWaktuSolat(saved);
        }
    }
});

const WORKER_URL = "https://green-dust-cb98.azamuslim.workers.dev/";

// =========================
// 1) WAKTU SOLAT
// =========================
async function loadWaktuSolat(zone = "WLY01") {
    const solatBox = document.getElementById("solatBox");
    solatBox.innerHTML = "🕌 Memuatkan waktu solat...";

    try {
        const response = await fetch(`${WORKER_URL}?kawasan=${zone}`);
        const data = await response.json();

        if (data.error) {
            solatBox.innerHTML = "❌ Gagal memuatkan waktu solat";
            return;
        }

        const w = data.prayer_times;

        solatBox.innerHTML = `
            <strong>Waktu Solat</strong><br>
            Subuh: ${w.fajr}<br>
            Syuruk: ${w.syuruk}<br>
            Zohor: ${w.dhuhr}<br>
            Asar: ${w.asr}<br>
            Maghrib: ${w.maghrib}<br>
            Isyak: ${w.isha}
        `;
    } catch (e) {
        solatBox.innerHTML = "❌ Waktu solat gagal dimuat";
    }
}

// =========================
// 2) VISITOR COUNTER
// =========================
function loadVisitors() {
    const el = document.getElementById("visitCount");

    fetch(`${WORKER_URL}?counter=true`)
        .then(r => r.json())
        .then(d => {
            el.innerHTML = d.visits;
        })
        .catch(() => {
            el.innerHTML = "Err";
        });
}

// =========================
// 3) ON PAGE LOAD
// =========================
document.addEventListener("DOMContentLoaded", () => {

    // Default KL
    loadWaktuSolat("WLY01");

    // Visitor
    loadVisitors();

    // Dropdown pilih negeri
    const stateSel = document.getElementById("stateSelect");
    if (stateSel) {
        stateSel.addEventListener("change", () => {
            loadWaktuSolat(stateSel.value);
            localStorage.setItem("chosenState", stateSel.value);
        });

        // load saved
        const saved = localStorage.getItem("chosenState");
        if (saved) {
            stateSel.value = saved;
            loadWaktuSolat(saved);
        }
    }
});

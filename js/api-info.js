// ======================================
// CONFIG
// ======================================
const WORKER_URL = "https://green-dust-cb98.azamuslim.workers.dev/";
const COUNTER_NAMESPACE = "ztakaful_app_visitors"; 
// (nama unik — bro boleh tukar kalau nak)

// ======================================
// 1) WAKTU SOLAT via Cloudflare Worker
// ======================================
async function loadWaktuSolat(zone = "WLY01") {
    const solatBox = document.getElementById("solatBox");
    solatBox.innerHTML = " Memuatkan waktu solat...";

    try {
        const response = await fetch(`${WORKER_URL}?kawasan=${zone}`);
        const data = await response.json();

        if (data.error || !data.prayer_times) {
            solatBox.innerHTML = " Gagal memuatkan waktu solat";
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
        solatBox.innerHTML = " Waktu solat gagal dimuat";
    }
}

// ======================================
// 2) VISITOR COUNTER — CountAPI (simple)
// ======================================
async function loadVisitors() {
    const el = document.getElementById("visitCount");
    if (!el) return;

    try {
        const response = await fetch(
            `https://api.countapi.xyz/hit/${COUNTER_NAMESPACE}`
        );
        const data = await response.json();

        el.innerHTML = data.value || 0;
    } catch (e) {
        el.innerHTML = "Err";
    }
}

// ======================================
// 3) PAGE LOAD
// ======================================
document.addEventListener("DOMContentLoaded", () => {

    // Waktu solat default KL
    loadWaktuSolat("WLY01");

    // Visitor counter
    loadVisitors();

    // Dropdown pilih negeri
    const stateSel = document.getElementById("stateSelect");
    if (stateSel) {
        stateSel.addEventListener("change", () => {
            loadWaktuSolat(stateSel.value);
            localStorage.setItem("chosenState", stateSel.value);
        });

        // Load pilihan negeri simpan
        const saved = localStorage.getItem("chosenState");
        if (saved) {
            stateSel.value = saved;
            loadWaktuSolat(saved);
        }
    }
});

// ======================================================
// API SOLAT (FINAL VERSION) — WORKING WITH MONTHLY ARRAY
// ======================================================

function unixToTime(ts) {
    const d = new Date(ts * 1000);
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
}

async function loadWaktuSolat(zone = "WLY01") {
    const box = document.getElementById("solatBox");
    box.innerHTML = "🕌 Memuatkan waktu solat...";

    try {
        const url = `https://api.waktusolat.app/v2/solat/${zone}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data?.prayers || !Array.isArray(data.prayers)) {
            box.innerHTML = "❌ Tiada data solat";
            return;
        }

        // Cari hari ini
        const today = new Date().getDate(); 
        const hariIni = data.prayers.find(p => p.day === today);

        if (!hariIni) {
            box.innerHTML = "❌ Waktu solat hari ini tiada";
            return;
        }

        box.innerHTML = `
            <strong>Waktu Solat</strong><br>
            Subuh: ${unixToTime(hariIni.fajr)}<br>
            Syuruk: ${unixToTime(hariIni.syuruk)}<br>
            Zohor: ${unixToTime(hariIni.dhuhr)}<br>
            Asar: ${unixToTime(hariIni.asr)}<br>
            Maghrib: ${unixToTime(hariIni.maghrib)}<br>
            Isyak: ${unixToTime(hariIni.isha)}
        `;

    } catch (err) {
        box.innerHTML = "❌ Gagal memuatkan waktu solat";
    }
}


// =============================
// AUTO LOAD 
// =============================
document.addEventListener("DOMContentLoaded", () => {
    loadWaktuSolat("WLY01");

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

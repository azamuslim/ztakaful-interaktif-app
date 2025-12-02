// =================================================
// PLAN A: API WAKTU SOLAT (tanpa Worker, sangat stabil)
// =================================================

// Mapping zone -> code (ikut API baru)
const ZONE_API_MAP = {
    "WLY01": "wlp",   // Kuala Lumpur / Putrajaya
    "JHR01": "jhr",   // Johor
    "KDH01": "kdh",   // Kedah
    "KTN01": "ktn",   // Kelantan
    "MLK01": "mlk",   // Melaka
    "NSN01": "nsn",   // Negeri Sembilan
    "PHG01": "phg",   // Pahang
    "PNG01": "png",   // Pulau Pinang
    "PRK01": "prk",   // Perak
    "PLS01": "pls",   // Perlis
    "SBH01": "sbh",   // Sabah
    "SWK01": "swk",   // Sarawak
    "SGR01": "sgr",   // Selangor
    "TRG01": "trg"    // Terengganu
};


// =============================
// 1) LOAD WAKTU SOLAT
// =============================
async function loadWaktuSolat(zone = "WLY01") {
    const box = document.getElementById("solatBox");
    box.innerHTML = "🕌 Memuatkan waktu solat...";

    try {
        const zonCode = ZONE_API_MAP[zone] || "wlp";

        const url = `https://api.waktusolat.app/v2/solat/${zonCode}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data?.today) {
            box.innerHTML = "❌ Gagal memuatkan waktu solat";
            return;
        }

        const w = data.today;

        box.innerHTML = `
            <strong>Waktu Solat</strong><br>
            Subuh: ${w.Subuh}<br>
            Syuruk: ${w.Syuruk}<br>
            Zohor: ${w.Zohor}<br>
            Asar: ${w.Asar}<br>
            Maghrib: ${w.Maghrib}<br>
            Isyak: ${w.Isyak}
        `;
    } catch (err) {
        box.innerHTML = "❌ Gagal memuatkan waktu solat";
    }
}



// =====================================================
// PLAN C: VISITOR COUNTER LOCALSTORAGE (NO ERROR)
// =====================================================
function loadVisitors() {
    let visits = localStorage.getItem("ztakaful_visits");

    if (!visits) visits = 0;

    visits = parseInt(visits) + 1;

    localStorage.setItem("ztakaful_visits", visits);

    document.getElementById("visitCount").innerHTML = visits;
}



// =============================
// PAGE LOAD
// =============================
document.addEventListener("DOMContentLoaded", () => {

    // Default: KL
    loadWaktuSolat("WLY01");

    // Visitor Counter
    loadVisitors();

    // Negeri Dropdown
    const stateSel = document.getElementById("stateSelect");

    if (stateSel) {
        stateSel.addEventListener("change", () => {
            loadWaktuSolat(stateSel.value);
            localStorage.setItem("chosenState", stateSel.value);
        });

        // Load simpanan user
        const saved = localStorage.getItem("chosenState");
        if (saved) {
            stateSel.value = saved;
            loadWaktuSolat(saved);
        }
    }
});

// ===============================
//  API INFO (SOLAT + VISITOR)
//  Guna Cloudflare Worker Proxy
// ===============================

// URL Cloudflare Worker Bro
const WORKER_URL = "https://green-dust-cb98.azamuslim.workers.dev/solat?zone=${JAKIM_ZONE}`,

// -------------------------------
// 1) FETCH WAKTU SOLAT
// -------------------------------
async function loadWaktuSolat(kawasan = "WP KUALA LUMPUR") {
    const solatBox = document.getElementById("solatBox");
    solatBox.innerHTML = `<p>Sedang memuatkan waktu solat...</p>`;

    try {
        const response = await fetch(`${WORKER_URL}?kawasan=${encodeURIComponent(kawasan)}`);
        const data = await response.json();

        if (data.error) {
            solatBox.innerHTML = `<p>Error: ${data.error}</p>`;
            return;
        }

        const w = data.prayer_times;

        solatBox.innerHTML = `
            <h3>Waktu Solat - ${kawasan}</h3>
            <ul>
                <li>Subuh: ${w.Subuh}</li>
                <li>Syuruk: ${w.Syuruk}</li>
                <li>Zohor: ${w.Zohor}</li>
                <li>Asar: ${w.Asar}</li>
                <li>Maghrib: ${w.Maghrib}</li>
                <li>Isyak: ${w.Isyak}</li>
            </ul>
        `;
    } catch (err) {
        solatBox.innerHTML = `<p>Gagal memuatkan waktu solat.</p>`;
        console.error("Waktu Solat Error:", err);
    }
}

// -------------------------------
// 2) VISITOR COUNTER
// -------------------------------
function loadVisitorCounter() {
    const visitBox = document.getElementById("visitCount");

    fetch(`${WORKER_URL}?counter=true`)
        .then(res => res.json())
        .then(data => {
            visitBox.innerHTML = `<p>Jumlah Pelawat: ${data.visits}</p>`;
        })
        .catch(err => {
            visitBox.innerHTML = `<p>Gagal memuat pelawat</p>`;
            console.error("Visitor Error:", err);
        });
}

// -------------------------------
// AUTO RUN BILA PAGE LOAD
// -------------------------------
document.addEventListener("DOMContentLoaded", function () {

    // Default Kuala Lumpur / Putrajaya
    loadWaktuSolat("WP KUALA LUMPUR");

    // Load visitor
    loadVisitorCounter();

    // State dropdown (kalau ada)
    const stateSel = document.getElementById("stateSelect");
    if (stateSel) {
        stateSel.addEventListener("change", function () {
            loadWaktuSolat(stateSel.value);
        });
    }
});

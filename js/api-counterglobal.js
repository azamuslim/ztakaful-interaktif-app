// ======================================================
// GLOBAL VISITOR COUNTER (Cloudflare KV)
// ======================================================

const COUNTER_URL = "https://green-dust-cb98.azamuslim.workers.dev/";

async function loadVisitorsGlobal() {
    const el = document.getElementById("visitCount");
    if (!el) return;

    try {
        const res = await fetch(COUNTER_URL);
        const data = await res.json();

        if (data.visits !== undefined) {
            el.innerHTML = data.visits;
        } else {
            el.innerHTML = "Err";
        }

    } catch (e) {
        el.innerHTML = "Err";
    }
}


// =============================
// AUTO LOAD
// =============================
document.addEventListener("DOMContentLoaded", () => {
    loadVisitorsGlobal();
});

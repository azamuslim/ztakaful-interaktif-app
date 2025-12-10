// ===============================
// RSS / FEED ARUS PERDANA
// ===============================
async function loadRSSFeeds() {
  const container = document.getElementById("rssFeedContainer");
  container.innerHTML = "<p>Loading feed...</p>";

  const sources = [
    { name: "Dagang News", url: "https://ztakaful-interaktif-app.onrender.com/news/dagangnews" },
    { name: "Bernama", url: "https://ztakaful-interaktif-app.onrender.com/news/bernama" },
    { name: "TMR", url: "https://ztakaful-interaktif-app.onrender.com/news/tmr" },
    { name: "Harian Metro", url: "https://ztakaful-interaktif-app.onrender.com/news/harianmetro" },
    { name: "Malay Mail", url: "https://ztakaful-interaktif-app.onrender.com/news/malaymail" }
  ];

  let allNews = [];

  for (const src of sources) {
    try {
      const res = await fetch(src.url);
      const data = await res.json();

      // ============ SAFETY CHECK ============
      if (!Array.isArray(data)) {
        console.warn(`Feed error from ${src.name}:`, data.error);
        continue;  // Skip feed yang error
      }

      const formatted = data.map(item => ({
        source: src.name,
        title: item.title || "",
        content: (item.content || "").slice(0, 150) + "...",
        url: item.url || "#"
      }));

      allNews.push(...formatted);

    } catch (err) {
      console.error(`RSS Fetch Error (${src.name}):`, err);
    }
  }

  // Kalau semua gagal
  if (allNews.length === 0) {
    container.innerHTML = "<p>Gagal memuatkan RSS feed.</p>";
    return;
  }

  // Render
  container.innerHTML = "";
  allNews.forEach(news => {
    container.innerHTML += `
      <div class="rss-card">
        <h3>${news.title}</h3>
        <p class="rss-content">${news.content}</p>
        <a href="${news.url}" target="_blank" class="rss-link">
          Baca lanjut (${news.source})
        </a>
      </div>
    `;
  });
}



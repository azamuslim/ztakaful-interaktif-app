// ===============================
// RSS / FEED ARUS PERDANA (Robust Version)
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
      if (!res.ok) {
        console.warn(`RSS Fetch HTTP Error (${src.name}):`, res.status);
        continue;
      }

      const data = await res.json();
      console.log(`${src.name} raw data:`, data);

      // Kalau data bukan array, cuba cek property 'items' atau 'news'
      let newsArray = [];
      if (Array.isArray(data)) {
        newsArray = data;
      } else if (Array.isArray(data.items)) {
        newsArray = data.items;
      } else if (Array.isArray(data.news)) {
        newsArray = data.news;
      } else {
        console.warn(`Feed error from ${src.name}: data bukan array`);
        continue;
      }

      const formatted = newsArray.map(item => ({
        source: src.name,
        title: item.title || "Tiada tajuk",
        content: (item.content || item.description || "").slice(0, 150) + "...",
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

  // Render feed
  container.innerHTML = "";
  allNews.forEach(news => {
    const card = document.createElement("div");
    card.className = "rss-card";

    card.innerHTML = `
      <h3>${news.title}</h3>
      <p class="rss-content">${news.content}</p>
      <a href="${news.url}" target="_blank" class="rss-link">
        Baca lanjut (${news.source})
      </a>
    `;
    container.appendChild(card);
  });
}

// Panggil function selepas DOM ready
document.addEventListener("DOMContentLoaded", loadRSSFeeds);




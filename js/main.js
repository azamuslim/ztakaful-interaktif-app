// ===============================
// RSS / FEED ARUS PERDANA
// ===============================
async function loadRSSFeeds() {
  const container = document.getElementById("rssFeedContainer");
  container.innerHTML = "<p>Loading feed...</p>";

  const sources = [
    { name: "Dagang News", url: "http://localhost:5000/news/dagangnews" },
    { name: "Bernama", url: "http://localhost:5000/news/bernama" },
    { name: "The Malaysian Reserve", url: "http://localhost:5000/news/tmr" },
    { name: "Harian Metro", url: "http://localhost:5000/news/harianmetro" },
    { name: "Malay Mail", url: "http://localhost:5000/news/malaymail" }
  ];

  let allNews = [];

  try {
    for (const src of sources) {
      const res = await fetch(src.url);
      const data = await res.json();

      const formatted = data.map(item => ({
        source: src.name,
        title: item.title,
        content: item.content?.slice(0, 150) + "...",
        url: item.url || "#"
      }));

      allNews.push(...formatted);
    }

    container.innerHTML = "";

    allNews.forEach(news => {
      container.innerHTML += `
        <div class="news-card">
          <h3>${news.title}</h3>
          <p class="news-date">${news.source}</p>
          <p>${news.content}</p>
          <a href="${news.url}" target="_blank" class="rss-link">Baca lanjut</a>
        </div>
      `;
    });

  } catch (err) {
    console.error("RSS Feed Error:", err);
    container.innerHTML = "<p style='color:red'>Gagal memuatkan RSS feed.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadRSSFeeds);


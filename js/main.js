<script>
async function loadRSSFeeds() {
  const container = document.getElementById("rssFeedContainer");
  container.innerHTML = "<p>Loading feed...</p>";

  const sources = [
    { name: "Dagang News", url: "http://localhost:5000/news/dagangnews" },
    { name: "Bernama", url: "http://localhost:5000/news/bernama" },
    { name: "TMR", url: "http://localhost:5000/news/tmr" },
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

    // Sort by most recent if timestamp available
    container.innerHTML = "";

    allNews.forEach(news => {
      container.innerHTML += `
        <div class="rss-card">
          <div class="rss-title">${news.title}</div>
          <div class="rss-content">${news.content}</div>
          <a class="rss-link" href="${news.url}" target="_blank">Baca lanjut (${news.source})</a>
        </div>
      `;
    });

  } catch (err) {
    console.error("RSS Error:", err);
    container.innerHTML = "<p>Gagal memuatkan RSS feed.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadRSSFeeds);
</script>

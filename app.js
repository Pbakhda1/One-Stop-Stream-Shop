// OSSS Demo Catalog
// NOTE: Major services (Netflix/Disney+/Apple TV/Prime Video) cannot be streamed inside your website.
// They use DRM and block embedding. So we provide "Watch Now" buttons that open the official sites.
// Trailers (or your own MP4) can play inside this website.

const CATALOG = [
  {
    title: "Suits",
    year: "2011–2019",
    type: "TV Series",
    services: [
      { name: "Netflix", url: "https://www.netflix.com/search?q=suits" },
      { name: "Prime Video", url: "https://www.amazon.com/s?k=suits&i=instant-video" },
      { name: "Apple TV", url: "https://tv.apple.com/search?term=suits" }
    ],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    title: "The Office (US)",
    year: "2005–2013",
    type: "TV Series",
    services: [
      { name: "Peacock", url: "https://www.peacocktv.com/search?q=the%20office" },
      { name: "Prime Video", url: "https://www.amazon.com/s?k=the+office&i=instant-video" },
      { name: "Apple TV", url: "https://tv.apple.com/search?term=the%20office" }
    ],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    title: "Avatar",
    year: "2009",
    type: "Movie",
    services: [
      { name: "Disney+", url: "https://www.disneyplus.com/search?q=avatar" },
      { name: "Prime Video", url: "https://www.amazon.com/s?k=avatar&i=instant-video" },
      { name: "Apple TV", url: "https://tv.apple.com/search?term=avatar" }
    ],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    title: "Naruto",
    year: "2002–2007",
    type: "TV Series",
    services: [
      { name: "Netflix", url: "https://www.netflix.com/search?q=naruto" },
      { name: "Hulu", url: "https://www.hulu.com/search?q=naruto" },
      { name: "Crunchyroll", url: "https://www.crunchyroll.com/search?q=naruto" }
    ],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  },
  {
    title: "Interstellar",
    year: "2014",
    type: "Movie",
    services: [
      { name: "Prime Video", url: "https://www.amazon.com/s?k=interstellar&i=instant-video" },
      { name: "Apple TV", url: "https://tv.apple.com/search?term=interstellar" }
    ],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  },
  {
    title: "Stranger Things",
    year: "2016–",
    type: "TV Series",
    services: [
      { name: "Netflix", url: "https://www.netflix.com/search?q=stranger%20things" }
    ],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  }
];

const form = document.getElementById("searchForm");
const input = document.getElementById("queryInput");
const resultsEl = document.getElementById("results");
const hintEl = document.getElementById("resultsHint");

const playerArea = document.getElementById("playerArea");
const playerTitle = document.getElementById("playerTitle");
const videoPlayer = document.getElementById("videoPlayer");
const closePlayer = document.getElementById("closePlayer");

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("backToTop").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

closePlayer.addEventListener("click", () => {
  stopTrailer();
});

function stopTrailer(){
  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();
  playerArea.classList.add("hidden");
}

function normalize(str) {
  return str.trim().toLowerCase();
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function renderEmpty(query) {
  resultsEl.innerHTML = `
    <div class="empty">
      No results found for <strong>${escapeHtml(query)}</strong> in the demo catalog.<br/><br/>
      Try: <strong>Suits</strong>, <strong>The Office</strong>, <strong>Avatar</strong>, <strong>Naruto</strong>, <strong>Interstellar</strong>.<br/><br/>
      In a real OSSS app, this would query a streaming availability API and return accurate results by country.
    </div>
  `;
}

function openTrailer(item) {
  if (!item.trailer) return;

  playerTitle.textContent = `Trailer / Preview: ${item.title}`;
  videoPlayer.src = item.trailer;
  videoPlayer.load();
  playerArea.classList.remove("hidden");

  playerArea.scrollIntoView({ behavior: "smooth" });

  // Autoplay may be blocked; user can press play
  videoPlayer.play().catch(() => {});
}

function renderResults(items, query) {
  hintEl.textContent = items.length
    ? `Showing ${items.length} result(s) for "${query}".`
    : `No results for "${query}".`;

  if (!items.length) {
    renderEmpty(query);
    return;
  }

  resultsEl.innerHTML = items.map((item, idx) => `
    <article class="result-card">
      <h3>${escapeHtml(item.title)}</h3>
      <div class="muted small">${escapeHtml(item.type)} • ${escapeHtml(item.year)}</div>

      <div class="watch-row" aria-label="Watch options">
        ${item.services.map(s => `
          <a class="btn-watch" href="${s.url}" target="_blank" rel="noreferrer">
            Watch on ${escapeHtml(s.name)}
          </a>
        `).join("")}

        ${item.trailer ? `<button class="btn-trailer" type="button" data-trailer="${idx}">Watch Trailer</button>` : ""}
      </div>

      <p class="muted small" style="margin-top:10px;">
        Note: Major services stream only in their official apps/sites (DRM). OSSS launches them safely.
      </p>
    </article>
  `).join("");

  // Hook trailer buttons
  document.querySelectorAll("[data-trailer]").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.getAttribute("data-trailer"));
      openTrailer(items[index]);
    });
  });
}

function searchCatalog(query) {
  const q = normalize(query);
  if (!q) return [];

  // Contains match for demo
  return CATALOG.filter(item => normalize(item.title).includes(q));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = input.value;

  stopTrailer();

  if (!query.trim()) {
    hintEl.textContent = "Please type a title to search.";
    resultsEl.innerHTML = `<div class="empty">Type a show or movie name above and press Search.</div>`;
    return;
  }

  const results = searchCatalog(query);
  renderResults(results, query);

  document.querySelector(".results-section").scrollIntoView({ behavior: "smooth" });
});

// Optional: show a default empty state on first load
resultsEl.innerHTML = `<div class="empty">Search for a title above to see where to watch.</div>`;

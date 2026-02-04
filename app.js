// A small sample catalog for demo purposes.
// Later, you can replace this with real data from an API like JustWatch, TMDB + availability, etc.
const CATALOG = [
  {
    title: "Suits",
    year: "2011–2019",
    type: "TV Series",
    services: [
      { name: "Netflix", url: "https://www.netflix.com/search?q=suits" },
      { name: "Prime Video", url: "https://www.amazon.com/s?k=suits&i=instant-video" },
      { name: "Apple TV", url: "https://tv.apple.com/search?term=suits" }
    ]
  },
  {
    title: "The Office (US)",
    year: "2005–2013",
    type: "TV Series",
    services: [
      { name: "Peacock", url: "https://www.peacocktv.com/search?q=the%20office" },
      { name: "Prime Video", url: "https://www.amazon.com/s?k=the+office&i=instant-video" },
      { name: "Apple TV", url: "https://tv.apple.com/search?term=the%20office" }
    ]
  },
  {
    title: "Avatar",
    year: "2009",
    type: "Movie",
    services: [
      { name: "Disney+", url: "https://www.disneyplus.com/search?q=avatar" },
      { name: "Prime Video", url: "https://www.amazon.com/s?k=avatar&i=instant-video" },
      { name: "Apple TV", url: "https://tv.apple.com/search?term=avatar" }
    ]
  },
  {
    title: "Naruto",
    year: "2002–2007",
    type: "TV Series",
    services: [
      { name: "Netflix", url: "https://www.netflix.com/search?q=naruto" },
      { name: "Hulu", url: "https://www.hulu.com/search?q=naruto" },
      { name: "Crunchyroll", url: "https://www.crunchyroll.com/search?q=naruto" }
    ]
  },
  {
    title: "Interstellar",
    year: "2014",
    type: "Movie",
    services: [
      { name: "Prime Video", url: "https://www.amazon.com/s?k=interstellar&i=instant-video" },
      { name: "Apple TV", url: "https://tv.apple.com/search?term=interstellar" }
    ]
  }
];

const form = document.getElementById("searchForm");
const input = document.getElementById("queryInput");
const resultsEl = document.getElementById("results");
const hintEl = document.getElementById("resultsHint");

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("backToTop").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function normalize(str) {
  return str.trim().toLowerCase();
}

function renderEmpty(query) {
  resultsEl.innerHTML = `
    <div class="empty">
      No results found for <strong>${escapeHtml(query)}</strong> in the demo catalog.<br/><br/>
      Try: <strong>Suits</strong>, <strong>The Office</strong>, <strong>Avatar</strong>, <strong>Naruto</strong>, <strong>Interstellar</strong>.<br/><br/>
      In a real OSSS app, this would query a streaming availability API to search across services.
    </div>
  `;
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

function renderResults(items, query) {
  hintEl.textContent = items.length
    ? `Showing ${items.length} result(s) for "${query}".`
    : `No results for "${query}".`;

  if (!items.length) {
    renderEmpty(query);
    return;
  }

  resultsEl.innerHTML = items.map(item => `
    <article class="result-card">
      <h3>${escapeHtml(item.title)}</h3>
      <div class="muted small">${escapeHtml(item.type)} • ${escapeHtml(item.year)}</div>

      <div class="badges" aria-label="Available services">
        ${item.services.map(s => `
          <span class="badge">
            <a href="${s.url}" target="_blank" rel="noreferrer">${escapeHtml(s.name)}</a>
          </span>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function searchCatalog(query) {
  const q = normalize(query);
  if (!q) return [];

  // Contains match across titles
  return CATALOG.filter(item => normalize(item.title).includes(q));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = input.value;

  if (!query.trim()) {
    hintEl.textContent = "Please type a title to search.";
    resultsEl.innerHTML = `<div class="empty">Type a show or movie name above and press Search.</div>`;
    return;
  }

  const results = searchCatalog(query);
  renderResults(results, query);

  // Scroll to results for a nice UX
  document.querySelector(".results-section").scrollIntoView({ behavior: "smooth" });
});

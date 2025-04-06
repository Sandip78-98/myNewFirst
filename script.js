const API_URL = "https://www.eporner.com/api/v2/video/search/?per_page=30&thumbsize=big&order=top-weekly&lq=1&format=json";
const videosContainer = document.getElementById("videos-container");
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");

// Fetch and display videos
async function fetchVideos(query = "") {
  let url = API_URL;
  if (query) {
    url += `&query=${encodeURIComponent(query)}`;
  } else {
    const randomWord = getRandomQuery();
    url += `&query=${randomWord}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayVideos(data.videos);
    setRandomBackground(data.videos);
  } catch (err) {
    console.error("Error fetching videos:", err);
  }
}

function displayVideos(videos) {
  videosContainer.innerHTML = "";
  videos.forEach(video => {
    const thumb = video.thumbs?.[0]?.src;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${thumb}" alt="${video.title}" />
      <div class="card-title">${video.title}</div>
    `;
    card.addEventListener("click", () => {
      window.location.href = `player.html?id=${video.id}&title=${encodeURIComponent(video.title)}`;
    });
    videosContainer.appendChild(card);
  });
}

function setRandomBackground(videos) {
  const heroVideoContainer = document.getElementById("hero-video");
  if (!heroVideoContainer || videos.length === 0) return;

  const randomVideo = videos[Math.floor(Math.random() * videos.length)];
  const embedId = randomVideo.id;
  const embedUrl = `https://www.eporner.com/embed/${embedId}/?autoplay=1&mute=1`;

  heroVideoContainer.innerHTML = "";

  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.frameBorder = "0";
  iframe.allowFullscreen = true;
  iframe.allow = "autoplay; encrypted-media";
  iframe.setAttribute("muted", "");
  iframe.setAttribute("autoplay", "");
  iframe.setAttribute("playsinline", "");
  iframe.style.cssText = `
    width: 100vw;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
  `;

  heroVideoContainer.appendChild(iframe);
}

function getRandomQuery() {
  const keywords = ["fun", "hot", "couple", "asian", "american", "beach", "dildo", "kiss", "sex", "lesbian"];
  return keywords[Math.floor(Math.random() * keywords.length)];
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (query) {
    fetchVideos(query);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  input.value = "";
  fetchVideos();
});

const themeBtn = document.getElementById("theme-btn");

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = document.body.classList.contains("light") ? "light" : "dark";
    const newTheme = current === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });
}

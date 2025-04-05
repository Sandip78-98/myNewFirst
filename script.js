const API_URL = "https://www.eporner.com/api/v2/video/search/?per_page=30&thumbsize=big&order=top-weekly&gay=1&lq=1&format=json";
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

// Display thumbnails
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
  const heroVideo = document.getElementById("hero-video");
  if (!heroVideo || videos.length === 0) return;

  // Try to find a video with a good quality MP4
  const randomVideo = videos[Math.floor(Math.random() * videos.length)];
  const embedId = randomVideo.id;

  // Eporner does not provide direct MP4, so use their low quality stream workaround
  const mp4Url = `https://www.eporner.com/embed/${embedId}/?autoplay=1&mute=1`;

  // Use an iframe as fallback (in case video tag doesn't work)
  heroVideo.outerHTML = `
    <iframe 
      src="${mp4Url}" 
      frameborder="0" 
      allowfullscreen 
      allow="autoplay; encrypted-media"
      style="width:100vw;height:100%;position:absolute;top:0;left:0;z-index:0;pointer-events:none;"
    ></iframe>
  `;
}


// Random search words
function getRandomQuery() {
  const keywords = ["fun", "hot", "couple", "asian", "massage", "beach", "shower", "kiss", "dance", "party"];
  return keywords[Math.floor(Math.random() * keywords.length)];
}

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (query) {
    fetchVideos(query);
  }
});

// Reset input field on load
window.addEventListener("DOMContentLoaded", () => {
  input.value = "";
  fetchVideos(); // load random videos
});

// Theme toggle
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

const artistInput = document.querySelector("#artist");
const audioTag = document.querySelector("#audioTag");
const allBtns = document.querySelectorAll("button");
const bgDisplay = document.querySelectorAll(".bg-blur-display div");
const currentDurationInput = document.querySelector("#currentDuration");
const durationInput = document.querySelector("#duration");
const img = document.querySelector("#img");
const nextBtn = document.querySelector("#nextBtn");
const playerBox = document.querySelector(".player-box");
const pervBtn = document.querySelector("#pervBtn");
const progressBar = document.querySelector("#progressBar");
const progressBarContainer = document.querySelector("#progressBarContainer");
const playListBox = document.querySelector("#playListBox");
const playStopBtn = document.querySelector("#playStopBtn");
const shuffleBtn = document.querySelector("#shuffleBtn");
const titleInput = document.querySelector("#title");
const replayBtn = document.querySelector("#replayBtn");
const volumnBar = document.querySelector("#volumnBar");
const volumnBarContainer = document.querySelector("#volumnBarContainer");
const reloadBox = document.querySelector("#reload");
const mainBody = document.querySelector(".main-body");

let currentSongIdx = 0;
let songs = [];

const fetchSongsData = async (reload = false) => {
  if (reload) {
    reloadBox.classList.add("hidden");
    mainBody.classList.remove("hidden");
  }

  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/saadsalman708/CodeAlpha_ProjectName/refs/heads/main/music%20player/data/data.json",
    );
    if (!res.ok) throw new Error("Failed to fetch songs data");
    const data = await res.json();
    songs = data;

    renderPlayList();
    loadSong();

    toggleBtns();
  } catch (error) {
    console.error("Error fetching songs data:", error);
    reloadBox.classList.remove("hidden");
    mainBody.classList.add("hidden");
  }
};

fetchSongsData();

const toggleBtns = (isDisabled) => {
  allBtns.forEach((btn) => {
    btn.classList.add("allBtns");
    btn.disabled = false;
    btn.style.cursor = "pointer";
    btn.style.opacity = "1";
  });
};

const shuffleSongs = () => {
  const currentSong = songs[currentSongIdx];

  let rest = songs.filter((_, i) => i !== currentSongIdx);

  for (let i = rest.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }

  songs = [currentSong, ...rest];
  currentSongIdx = 0;
  renderPlayList();
  const currentSongFromPlayList = document.getElementById(currentSongIdx);
  currentSongFromPlayList.classList.add("highlight");
};

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
};

const loadSong = (i = currentSongIdx) => {
  const { title, artists, imgUrl, url } = songs[i];
  titleInput.innerHTML = title;
  artistInput.innerHTML = artists;
  audioTag.src = url;
  img.src = imgUrl;
  bgDisplay.forEach((bg) => (bg.style.backgroundImage = `url(${imgUrl})`));
  audioTag.onloadedmetadata = () => {
    durationInput.innerHTML = formatTime(audioTag.duration);
  };

  const currentActive = document.querySelector(".highlight");
  if (currentActive) {
    currentActive.classList.remove("highlight");
  }
  const currentSongFromPlayList = document.getElementById(i);
  currentSongFromPlayList.classList.add("highlight");

  progressBar.style.width = "0%";
  currentDurationInput.innerHTML = "00:00";
};

const changeIndex = (direction) => {
  if (direction === "+") {
    currentSongIdx =
      currentSongIdx >= songs.length - 1 ? 0 : currentSongIdx + 1;
  } else {
    currentSongIdx =
      currentSongIdx <= 0 ? songs.length - 1 : currentSongIdx - 1;
  }

  loadMaybePlay();
};

const loadMaybePlay = (shouldPlay = false) => {
  // shouldPlay => decides should next songs play

  const isPlaying = !audioTag.paused;

  loadSong();
  if (isPlaying || shouldPlay) audioTag.play();
};

const playThisSong = (i) => {
  currentSongIdx = i;
  loadMaybePlay(true);
};

const calculateProgressRatio = (e) => {
  const rect = progressBarContainer.getBoundingClientRect();
  const relativeX = (e.clientX - rect.left) / rect.width;
  const progress = Math.max(0, Math.min(1, relativeX));
  return Math.floor(progress * 100);
};

const renderPlayList = () => {
  playListBox.innerHTML = "";
  let ul = document.createElement("ul");
  const s = songs
    .map(({ title, artists, imgUrl }, index) => {
      return `
                <li id="${index}" onclick="playThisSong(${index})">
                    <div>
                        <img src="${imgUrl}" loading="lazy" />
                    </div>
                    <div>
                        <h4>${title}</h4>
                        <span>${artists}</span>
                    </div>
                </li>
                `;
    })
    .join("");

  ul.innerHTML = s;
  playListBox.appendChild(ul);
};

audioTag.addEventListener("timeupdate", () => {
  const percentage = (audioTag.currentTime / audioTag.duration) * 100;
  progressBar.style.width = `${percentage}%`;
  currentDurationInput.innerHTML = formatTime(audioTag.currentTime);
});

const playIcon = '<i class="fa-solid fa-play"></i>';
const pauseIcon = '<i class="fa-solid fa-pause"></i>';

audioTag.addEventListener("play", () => {
  playStopBtn.innerHTML = pauseIcon;
});

audioTag.addEventListener("pause", () => {
  playStopBtn.innerHTML = playIcon;
});

audioTag.addEventListener("ended", () => {
  changeIndex("+");
  loadMaybePlay(true); // true => next song should autopaly
});

progressBarContainer.addEventListener("click", (e) => {
  const progress = calculateProgressRatio(e);
  progressBar.style.width = `${progress}%`;
  audioTag.currentTime = (progress / 100) * audioTag.duration;
  currentDurationInput.innerHTML = formatTime(audioTag.currentTime);
});

volumnBarContainer.addEventListener("click", (e) => {
  const progress = calculateProgressRatio(e);
  volumnBar.style.width = `${progress}%`;
  audioTag.volume = progress / 100;
});

const togglePlay = () => {
  if (audioTag.paused) {
    audioTag.play();
  } else {
    audioTag.pause();
  }
};

shuffleBtn.addEventListener("click", () => shuffleSongs());
playStopBtn.addEventListener("click", () => togglePlay());
pervBtn.addEventListener("click", () => changeIndex("-"));
nextBtn.addEventListener("click", () => changeIndex("+"));
replayBtn.addEventListener("click", () => {
  audioTag.currentTime = 0;
  audioTag.play();
});

addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (e.code === "Space" || key === "f" || key === "p") {
    togglePlay();
  }
  if (
    e.key === "ArrowRight" ||
    (e.shiftKey && key === "n") ||
    (e.ctrlKey && key === "ArrowRight")
  ) {
    e.preventDefault();
    changeIndex("+");
  }
  if (e.key === "ArrowLeft" || (e.ctrlKey && key === "ArrowLeft")) {
    e.preventDefault();
    changeIndex("-");
  }
  if (
    key === "s" ||
    (e.shiftKey && key === "r") ||
    (e.shiftKey && key === "s") ||
    (e.ctrlKey && key === "r") ||
    (e.ctrlKey && key === "s")
  ) {
    e.preventDefault();
    shuffleSongs();
  }
  if (key === "r") {
    audioTag.currentTime = 0;
    audioTag.play();
  }
});

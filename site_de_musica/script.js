
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");
const tabPlaylist = document.getElementById("tab-playlist");
const tabPosts = document.getElementById("tab-posts");
const personalPlaylistSection = document.getElementById("personal-playlist-section");
const postsSection = document.getElementById("posts-section");
const postsList = document.getElementById("posts-list");
const postForm = document.getElementById("post-form");
const uploadMusicInput = document.getElementById("upload-music");

const allSongs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
  },
];

const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

const playSong = (id) => {
  const song = userData.songs.find((song) => song.id === id); 
  if (!song) return;
  audio.src = song.src;
  audio.title = song.title;
  if (userData.currentSong === null || userData.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData.songCurrentTime;
  }
  userData.currentSong = song;
  playButton.classList.add("playing");
  highlightCurrentSong();
  setPlayerDisplay(song.title, song.artist);
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();2
};

const playNextSong = () => {
  if (userData.currentSong === null) {
    playSong(userData.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData.songs[currentSongIndex + 1];
    if (nextSong) playSong(nextSong.id);
  }
};

const playPreviousSong = () => {
  if (userData.currentSong === null) return;
  const currentSongIndex = getCurrentSongIndex();
  const previousSong = userData.songs[currentSongIndex - 1];
  if (previousSong) playSong(previousSong.id);
};

const shuffle = () => {
  userData.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;
  renderSongs(userData.songs);
  pauseSong();
  setPlayerDisplay("", "");
  setPlayButtonAccessibleText();
};

const deleteSong = (id) => {
  if (userData.currentSong && userData.currentSong.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong();
    setPlayerDisplay("", "");
  }
  userData.songs = userData.songs.filter((song) => song.id !== id);
  renderSongs(userData.songs);
  highlightCurrentSong();
  setPlayButtonAccessibleText();
};

const setPlayerDisplay = (title, artist) => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  playingSong.textContent = title || "";
  songArtist.textContent = artist || "";
};

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(`song-${userData.currentSong ? userData.currentSong.id : ""}`);
  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });
  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const renderSongs = (array) => {
  const songsHTML = array
    .map((song) => {
      return `<li id="song-${song.id}" class="playlist-song">
        <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
        </button>
        <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#4d4d62"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/>
          </svg>
        </button>
      </li>`;
    })
    .join("");
  playlistSongs.innerHTML = songsHTML;
  
  if (userData.songs.length === 0) {
    const resetButton = document.createElement("button");
    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.textContent = "Reset Playlist";
    playlistSongs.appendChild(resetButton);
    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];
      renderSongs(sortSongs());
      setPlayButtonAccessibleText();
      resetButton.remove();
    });
  }
};

const setPlayButtonAccessibleText = () => {
  const song = userData.currentSong || userData.songs[0];
  playButton.setAttribute("aria-label", song && song.title ? `Play ${song.title}` : "Play");
};

const getCurrentSongIndex = () => userData.songs.indexOf(userData.currentSong);

uploadMusicInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const newSong = {
      id: Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Importado",
      duration: "??",
      src: URL.createObjectURL(file),
    };
    userData.songs.push(newSong);
    renderSongs(userData.songs);
  }
});

playButton.addEventListener("click", () => {
  if (userData.currentSong === null) {
    playSong(userData.songs[0].id);
  } else {
    playSong(userData.currentSong.id);
  }
});
pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
shuffleButton.addEventListener("click", shuffle);

audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData.songs[currentSongIndex + 1] !== undefined;
  if (nextSongExists) {
    playNextSong();
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong();
    setPlayerDisplay("", "");
    highlightCurrentSong();
    setPlayButtonAccessibleText();
  }
});

const sortSongs = () => {
  userData.songs.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });
  return userData.songs;
};

renderSongs(sortSongs());
setPlayButtonAccessibleText();

let posts = [];

const playPost = (index) => {
  const post = posts[index];
  if (!post) return;
  audio.src = post.src;
  setPlayerDisplay(post.title, post.artist);
  audio.play();
};

const renderPosts = () => {
  if (posts.length === 0) {
    postsList.innerHTML = "<li>Nenhum post ainda.</li>";
    return;
  }
  const postsHTML = posts
    .map((post, index) => {
      return `<li>
                <strong>${post.title}</strong> por ${post.artist} (${post.duration})
                <br/>
                <button onclick="playPost(${index})">Ouvir Música</button>
                <button onclick="deletePost(${index})" aria-label="Deletar post">Deletar</button>
              </li>`;
    })
    .join("");
  postsList.innerHTML = postsHTML;
};

const addPost = (post) => {
  posts.push(post);
  renderPosts();
};

const deletePost = (index) => {
  posts.splice(index, 1);
  renderPosts();
};

postForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("post-title").value;
  const artist = document.getElementById("post-artist").value;
  const duration = document.getElementById("post-duration").value;
  const srcURL = document.getElementById("post-src").value;
  const fileInput = document.getElementById("post-file");
  let src;
  if (fileInput.files && fileInput.files[0]) {
    src = URL.createObjectURL(fileInput.files[0]);
  } else {
    src = srcURL;
  }
  if (!src) return;
  const newPost = { title, artist, duration, src };
  addPost(newPost);
  postForm.reset();
});

tabPlaylist.addEventListener("click", () => {
  tabPlaylist.classList.add("active");
  tabPosts.classList.remove("active");
  personalPlaylistSection.style.display = "block";
  postsSection.style.display = "none";
});

tabPosts.addEventListener("click", () => {
  tabPosts.classList.add("active");
  tabPlaylist.classList.remove("active");
  personalPlaylistSection.style.display = "none";
  postsSection.style.display = "block";
});

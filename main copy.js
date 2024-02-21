document.addEventListener("DOMContentLoaded", function () {
  const audioFiles = [
    "autumn-breeze.m4a",
    "birds.m4a",
    "bonfire.m4a",
    "brook.m4a",
    "brown-noise.m4a",
    "calm-shore.m4a",
    "close-waterfall.m4a",
    "closer-thunder.m4a",
    "coastal-wind.m4a",
    "cocktail-voices.m4a",
    "coffee-house.m4a",
    "creek.m4a",
    "distant-thunder.m4a",
    "distant-waterfall.m4a",
    "fan-noise.m4a",
    "forest-wind.m4a",
    "frogs.m4a",
    "heat-wave.m4a",
    "large-waves.m4a",
    "meditation-time.m4a",
    "ocean-waves.m4a",
    "pink-noise.m4a",
    "pouring-rain.m4a",
    "rain-drops.m4a",
    "shore.m4a",
    "stream.m4a",
    "summer-night.m4a",
    "white-noise.m4a",
    "wild-shore.m4a",
    "wind-chimes.m4a",
  ]; // List your audio file names here
  const audioList = document.getElementById("audioList");

  const favorites = new Map(
    JSON.parse(localStorage.getItem("favorites") || "[]"),
  );

  audioFiles.forEach((file, index) => {
    const audioItem = document.createElement("div");
    audioItem.classList.add("audio-item");

    // add audiofile name
    const audioName = document.createElement("p");
    audioName.innerHTML = file.split(".")[0];
    audioItem.appendChild(audioName);

    // add favorite checkbox
    const favoriteCheckbox = document.createElement("input");
    favoriteCheckbox.type = "checkbox";
    favoriteCheckbox.checked = favorites.get(`audio-${index}`) || false;
    favoriteCheckbox.onchange = function () {
      favorites.set(`audio-${index}`, this.checked);
      localStorage.setItem(
        "favorites",
        JSON.stringify(Array.from(favorites.entries())),
      );
      if (this.checked) {
        audioList.prepend(audioItem);
      } else {
        audioList.appendChild(audioItem);
      }
    };
    audioItem.appendChild(favoriteCheckbox);

    const audio = new Audio(`./music/${file}`);
    audio.id = `audio-${index}`;

    // Add event listener to start audio when it ends
    audio.addEventListener("ended", function () {
      this.currentTime = 0;
      this.play();
    });

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 0;
    slider.max = 1;
    slider.step = 0.01;
    slider.value = 0;
    slider.classList.add("slider");

    // save current state to local storage
    if (localStorage.getItem(`audio-${index}`)) {
      audio.volume = localStorage.getItem(`audio-${index}`);
      slider.value = localStorage.getItem(`audio-${index}`);
    }

    // save volume to local storage
    slider.onchange = function () {
      localStorage.setItem(`audio-${index}`, this.value);
    };

    slider.oninput = function () {
      audio.volume = this.value;
      if (this.value > 0) {
        // add active class to audio item
        audioItem.classList.add("active");
        if (audio.paused) audio.play();
      } else {
        // remove active class from audio item
        audioItem.classList.remove("active");
        audio.pause();
      }
    };

    audioItem.appendChild(audio);
    audioItem.appendChild(slider);
    if (favoriteCheckbox.checked) {
      audioList.prepend(audioItem);
    } else {
      audioList.appendChild(audioItem);
    }
  });

  // add resume button
  const resumeButton = document.createElement("button");
  resumeButton.innerHTML = "Resume All";
  resumeButton.onclick = function () {
    audioFiles.forEach((file, index) => {
      if (localStorage.getItem(`audio-${index}`) > 0) {
        document
          .getElementById(`audio-${index}`)
          .parentNode.classList.add("active");
        document.getElementById(`audio-${index}`).play();
      }
    });
  };

  audioList.appendChild(resumeButton);
});

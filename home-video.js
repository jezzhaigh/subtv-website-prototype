document.addEventListener("DOMContentLoaded", () => {
  const frame = document.getElementById("student-voices-video");
  const toggle = document.querySelector(".home-video-sound-toggle");

  if (!frame || !toggle) return;

  let soundOn = false;

  const sendToPlayer = (method, value) => {
    if (!frame.contentWindow) return;

    const message = value === undefined ? { method } : { method, value };
    frame.contentWindow.postMessage(
      JSON.stringify(message),
      "https://player.vimeo.com"
    );
  };

  toggle.addEventListener("click", () => {
    soundOn = !soundOn;

    if (soundOn) {
      sendToPlayer("play");
      sendToPlayer("setVolume", 1);
      toggle.textContent = "Mute video";
    } else {
      sendToPlayer("setVolume", 0);
      toggle.textContent = "Play with sound";
    }

    toggle.setAttribute("aria-pressed", String(soundOn));
  });
});



let activeVideo = null;

function checkVideo () {

  const videos = document.getElementsByTagName('video');

  if (activeVideo && !isPlaying(activeVideo)) {
    activeVideo = null;
  }

  for (let video of videos) {
    if (!isPlaying(video)) {
      continue;
    }
    if (activeVideo !== video) {
      activeVideo = video;
      console.log('New active video', activeVideo);
    }
    break;
  }

  setTimeout(checkVideo, 200);
}

checkVideo();

function isPlaying (video) {
  return !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
}

chrome.runtime.onMessage.addListener(function ({ command }) {
  
  if (!activeVideo) {
    return;
  }

  switch(command) {
    case 'video-speed-up':
      activeVideo.playbackRate += activeVideo.playbackRate <= 2 ? 0.25 : 0.1;
      break;
    case 'video-slow-down':
      activeVideo.playbackRate -= 0.1;
      break;
    case 'video-max-speed':
      let hasError = false;
      do {
        try {
          activeVideo.playbackRate += 1;
        } catch {
          hasError = true;
        }
      } while(activeVideo.playbackRate < 100 && !hasError);
      break;
  }
  
  activeVideo.playbackRate = Math.round(activeVideo.playbackRate * 100) / 100;

  const div = document.createElement("div");
  div.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 15px 33px; background: rgba(51, 51, 51, 0.75); color: #FFFFFF; font-size: 20px; z-index: 9999999; border-radius: 20px;'
  div.innerText = "Speed: " + activeVideo.playbackRate.toFixed(2) + "x";
  document.body.appendChild(div);

  function remove () {
    document.body.removeChild(div);
  }
  setTimeout(remove, 500);

  console.log('New playbackRate: ', activeVideo.playbackRate);
});

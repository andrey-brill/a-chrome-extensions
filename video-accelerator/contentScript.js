

function activateExtension (onMessage) {

    var popupStyle = [
        'position: fixed',
        'top: 20px',
        'right: 20px',
        'padding: 15px 33px',
        'background: rgba(51, 51, 51, 0.75)',
        'color: #FFFFFF',
        'font-size: 20px',
        'z-index: 999999',
        'border-radius: 8px'
    ].join('; ');

    function showPopup (text) {

        var popup = document.createElement('div');
        popup.style.cssText = popupStyle;
        popup.innerText = text;
        document.body.appendChild(popup);

        setTimeout(function () {
            document.body.removeChild(popup);
        }, 1000);
    }

    function isPlaying (video) {
        return !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
    }

    function adjustPlaybackRate (video, direction) {

        var playbackRate = video.playbackRate;
        var k = null;
        if (direction === 'up') {
            k = (1.0 <= playbackRate && playbackRate < 2) ? 0.25 : 0.10;
        } else {
            k = (1.0 < playbackRate && playbackRate <= 2) ? -0.15 : -0.10;
        }

        try {
            video.playbackRate = playbackRate + k;
            video.playbackRate = Math.round(video.playbackRate * 100) / 100;
            showPopup('Speed: ' + video.playbackRate.toFixed(2) + 'x');
        } catch {
            showPopup('Can not adjust playback speed anymore');
        }
    }

    var commands = {
        'video-speed-up': function (activeVideo) {
            adjustPlaybackRate(activeVideo, 'up');
        },
        'video-slow-down': function (activeVideo) {
            adjustPlaybackRate(activeVideo, 'down');
        },
        'video-reset-speed': function (activeVideo) {
            activeVideo.playbackRate = 1;
            showPopup('Speed: 1x');
        },
        'video-max-speed': function (activeVideo) {
            var hasError = false;
            do {
                try {
                    activeVideo.playbackRate += 1;
                } catch {
                    hasError = true;
                }
            } while(activeVideo.playbackRate < 100 && !hasError);
            showPopup('Speed: Max');
        }
    }

    onMessage.addListener(function (command) {

        const fn = commands[command];
        if (!fn) return; // ignoring if command is unknown (probably from other extension)

        var videos = document.getElementsByTagName('video');
        for (var video of videos) {
            if (isPlaying(video)) {
                return fn(video);
            }
        }

        showPopup('Play video');
    });

}

activateExtension(chrome.runtime.onMessage);

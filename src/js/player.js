/* ; (function () { */
let player;

const playerContainer = $(".player");

let eventsInit = () => {
  $(".player__start").click(e => {
    e.preventDefault();

    if (playerContainer.hasClass("paused")) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });

  $(".player__playback").click(e => {
    const bar = $(e.currentTarget);
    const clickedPosition = e.originalEvent.layerX;
    const newButtonPositionPercent = (clickedPosition / bar.width()) * 100;
    const newPlaybackPositionSec =
      (player.getDuration() / 100) * newButtonPositionPercent;

    $(".player__playback-button").css({
      left: `${newButtonPositionPercent}%`
    });

    player.seekTo(newPlaybackPositionSec);
  });

  $(".player__splash").click(e => {
    player.playVideo();
  })
};

const formatTime = timeSec => {
  const roundTime = Math.round(timeSec);

  const minutes = addZero(Math.floor(roundTime / 60));
  const seconds = addZero(roundTime - minutes * 60);

  function addZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  return `${minutes} : ${seconds}`;
};

const onPlayerReady = () => {
  let interval;
  const durationSec = player.getDuration();

  $(".player__duration-estimate").text(formatTime(durationSec));

  if (typeof interval !== "undefined") {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    const completedSec = player.getCurrentTime();
    const completedPercent = (completedSec / durationSec) * 100;

    $(".player__playback-button").css({
      left: `${completedPercent}%`
    });

    $(".player__duration-completed").text(formatTime(completedSec));
  }, 1000);
};

const onPlayerStateChange = event => {
  /*
    -1 (воспроизведение видео не начато)
    0 (воспроизведение видео завершено)
    1 (воспроизведение)
    2 (пауза)
    3 (буферизация)
    5 (видео подают реплики).
  */
  switch (event.data) {
    case 1:
      playerContainer.addClass("active");
      playerContainer.addClass("paused");
      break;

    case 2:
      playerContainer.removeClass("active");
      playerContainer.removeClass("paused");
      break;
  }
};

function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    height: "392",
    width: "662",
    videoId: "6eHN3daGoYQ",
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    },
    playerVars: {
      controls: 0,
      disablekb: 0,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 0
    }
  });
}

eventsInit();

const mute = $('.player__mute');
const MAX_VOLUME = 100;
let soundLevel;

$('.player__volume-button').css({
  left: `${MAX_VOLUME}%`
});

$('.player__volume').click((e) => {
  const barVolume = $(e.currentTarget);
  const clickedVolumePosition = e.originalEvent.layerX;
  const newVolumePositionPercent = (clickedVolumePosition / barVolume.width()) * 100;
  const newSoundPosition = player.setVolume(newVolumePositionPercent);

  $('.player__volume-button').css({
    left: `${newVolumePositionPercent}%`
  });

  player.setVolume(newSoundPosition);
});

$(mute).click(e => {

  if (player.isMuted()) {
    $('.player__volume-button').css({
      left: `${soundLevel}%`
    });
    player.unMute();
  } else {
    soundLevel = player.getVolume();
    $('.player__volume-button').css({
      left: `0`
    });
    player.mute();
  }
});
/* })() */
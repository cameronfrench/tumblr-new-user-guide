var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    playerVars: {
      'playsinline': 1,
      'listType': 'playlist',
      'list': 'PLeuya145vwVB0Q1v7yveI8RM8hCxq6g1j'
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  var playlistData = player.getPlaylist(); // Retrieve the playlist data

  // Create an HTML element for each video in the playlist
  for (var i = 2; i < playlistData.length; i++) {
    var videoId = playlistData[i];
    var videoContainer = document.getElementById('player-2');
    videoContainer.id = 'video-' + videoId;
    document.appendChild(videoContainer);

    // Create a new player for each video
    new YT.Player(videoContainer.id, {
      height: '315',
      width: '560',
      videoId: videoId,
      playerVars: {
        'autoplay': 0,
        'controls': 1,
        'rel': 0,
        'showinfo': 0
      }
    });
  }
}
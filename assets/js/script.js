var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var players = {}; // Object to store player instances
var playlistData;

function onYouTubeIframeAPIReady() {
  // Initialize players for each section
  createPlayer('videos', 'PLeuya145vwVB0Q1v7yveI8RM8hCxq6g1j');
  
}

function createPlayer(containerId, playlistId) {
  players[containerId] = new YT.Player(containerId, {
    height: '390',
    width: '640',
    playerVars: {
      'playsinline': 1,
      'listType': 'playlist',
      'list': playlistId
    },
    events: {
      'onReady': function(event) {
        playlistData = event.target.getPlaylist(); // Retrieve the playlist data
        createPlaylistPlayers(containerId);
      }
    }
  });
}

function createPlaylistPlayers(containerId) {
  var playerContainer = document.getElementById(containerId);
  playerContainer.innerHTML = ''; // Clear the content of the player container

  // Start the loop from index 0
  for (var i = 0; i < playlistData.length; i++) {
    var videoId = playlistData[i];
    var videoContainer = document.createElement('div');
    videoContainer.id = 'video-' + videoId;
    videoContainer.classList.add('video-container');
    playerContainer.appendChild(videoContainer);

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

var apiUrl = 'https://api.tumblr.com/v2/tagged?api_key=uLW3zUKulKflotjG2H7f7DS5I5cWcxNDADH5EuBFLyPvRlD7nk&tag=animals';

// Fetch request
fetch(apiUrl)
  .then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data);
        // Process the retrieved data here
        displayData(data);
      });
    } else {
      console.log('Request failed with status:', response.status);
    }
  })
  .catch(function(error) {
    console.log('Request failed:', error);
  });

function displayData(data) {
  var resultElement = document.getElementById('results');
  
  // Clear previous content
  resultElement.innerHTML = '';

  // Iterate over the data and create HTML elements for each item
  data.response.forEach(function(item) {
    if (item.type === 'photo') {
      var itemElement = document.createElement('div');
      
      // Iterate over the photos and create HTML elements for each photo
      item.photos.forEach(function(photo) {
        var photoElement = document.createElement('img');
        photoElement.src = photo.original_size.url;
        itemElement.appendChild(photoElement);
      });

      resultElement.appendChild(itemElement);
    }
  });
}


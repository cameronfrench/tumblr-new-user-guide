var searchHistory = JSON.parse(localStorage.getItem("tags")) || [];
var tagFormEl = document.querySelector("#tag-form");
var tagInputEl = document.querySelector("#tumblr-search");

// 1. Load the IFrame Player API code asynchronously for both videos.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. This function creates an <iframe> (and YouTube player) for the videos.
function onYouTubeIframeAPIReady() {
  // Create player for the first video
  var player1 = new YT.Player("player1", {
    height: "390",
    width: "640",
    videoId: "J3uxMQkL7XE", // Video ID for the first video
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: onPlayer1Ready,
      onStateChange: onPlayer1StateChange,
    },
  });

  // Create player for the second video
  var player2 = new YT.Player("player2", {
    height: "390",
    width: "640",
    videoId: "K-svwX764-g", // Video ID for the second video
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: onPlayer2Ready,
      onStateChange: onPlayer2StateChange,
    },
  });
}

// 3. The API will call these functions when the video players are ready.
function onPlayer1Ready(event) {
  event.target.playVideo();
}

function onPlayer2Ready(event) {
  event.target.playVideo();
}

// 4. The API calls these functions when the player's state changes.
//    The functions indicate that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done1 = false;
function onPlayer1StateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done1) {
    setTimeout(stopVideo1, 6000);
    done1 = true;
  }
}

var done2 = false;
function onPlayer2StateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done2) {
    setTimeout(stopVideo2, 6000);
    done2 = true;
  }
}

function stopVideo1() {
  player1.stopVideo();
}

function stopVideo2() {
  player2.stopVideo();
}

// Tumblr API
var formSubmitHandler = function (event) {
  event.preventDefault();

  var resultElement = document.getElementById("results");
  var tag = tagInputEl.value;

  if (tag) {
    searchHistory.push(tag);
    localStorage.setItem("tags", JSON.stringify(searchHistory));
    getTumblrTag(tag);

    resultElement.textContent = "";
    tagInputEl.value = "";
  } else {
    alert("That tag does not exist on Tumblr. Try a new one!");
  }
};

var buttonClickHandler = function (event) {
  var language = event.target.getAttribute("data-language");

  if (language) {
    getTumblrTag(language);

    resultElement.textContent = "";
  }
};

// main function to pull tag data
var getTumblrTag = function (tag) {
  var apiUrl =
    "https://api.tumblr.com/v2/tagged?api_key=uLW3zUKulKflotjG2H7f7DS5I5cWcxNDADH5EuBFLyPvRlD7nk&tag=" +
    tag +
    "&per_page=5";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          // Process the retrieved data here
          displayData(data);
        });
      } else {
        console.log("Request failed with status:", response.status);
      }
    })
    .catch(function (error) {
      console.log("Request failed:", error);
    });

  function displayData(data) {
    var resultElement = document.getElementById("results");

    // Clear previous content
    resultElement.innerHTML = "";

    // Iterate over the data and create HTML elements for each item
    data.response.forEach(function (item) {
      if (item.type === "photo") {
        var itemElement = document.createElement("div");

        // Iterate over the photos and create HTML elements for each photo
        item.photos.forEach(function (photo) {
          var photoElement = document.createElement("img");
          photoElement.src = photo.original_size.url;
          itemElement.appendChild(photoElement);
        });

        var blogName = item.blog_name;
        var postUrl = item.post_url;

        // Create HTML elements for displaying blog name and post URL
        var blogNameElement = document.createElement("p");
        blogNameElement.textContent = "Blog Name: " + blogName;

        var postUrlElement = document.createElement("p");
        var postUrlLink = document.createElement("a");
        postUrlLink.href = postUrl;
        postUrlLink.textContent = "Post URL";
        postUrlElement.appendChild(postUrlLink);

        // Append blog name and post URL elements to the item element
        itemElement.appendChild(blogNameElement);
        itemElement.appendChild(postUrlElement);

        // Create a container for the item's elements
        var containerElement = document.createElement("div");
        containerElement.appendChild(itemElement);

        resultElement.appendChild(itemElement);
      }
    });
  }
};

tagFormEl.addEventListener("submit", formSubmitHandler);
tagButtonsEl.addEventListener("click", buttonClickHandler);

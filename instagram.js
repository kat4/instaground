
// instaground encapsulation app

var instaground = (function() {
  "use strict";

  var clientHistoryString = "";
  if (document.cookie) {
    clientHistoryString = document.cookie;
  }


  // Check whether user is logged into instagram

  var newAccessKey = window.location.hash.slice(1);
  if (newAccessKey.slice(0, 13) !== "access_token=") {
    window.location = "https://instagram.com/oauth/authorize/?client_id=d80c733cf6c9474e8df5daffc9a9a2b7&redirect_uri=http://kat4.github.io/instaground&response_type=token";
  }

  // Request images from instagram
  function jsonp(callback) {
    var searchTag = document.getElementById('search-field').value;

    var url = 'https://api.instagram.com/v1/tags/' + searchTag + '/media/recent?' + newAccessKey;
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      callback(data);
      console.log(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
  }

  // Callback function
  function displayRandomImage(response) {
    var randomImageNum = Math.floor(Math.random() * 20);
    var randomImageUrl = response.data[randomImageNum].images.standard_resolution.url;
    document.getElementById('background-container').style.backgroundImage = 'url("' + randomImageUrl + '")';
    var clientHistory = JSON.parse(clientHistoryString);
    clientHistory.push(randomImageUrl);
    console.log ('history-var', clientHistory);
    clientHistoryString = JSON.stringify(clientHistory);
    document.cookie = clientHistoryString;
    console.log ('cookies', document.cookie);
  }

  return {
    jsonp: jsonp,
    displayRandomImage: displayRandomImage
  };

}());

// Search on enter key
var searchField = document.getElementById('search-field');
searchField.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    instaground.jsonp(instaground.displayRandomImage);
  }
});

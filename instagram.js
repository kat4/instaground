// instaground encapsulation app

var instaground = (function() {
  // use a subset of normal javascript which is has stricter rules
  "use strict";


  // function which changes URL of background image to URL passed as argument to the function
  function changeBackgroundTo(anImage) {
    return function() {
      document.getElementById('download').href = anImage.src;
      document.getElementById('background-container').style.backgroundImage = 'url("' + anImage.src + '")';
    };
  }

  // function which updates the search history. It is called when the page first loads, and when images are returned from instagram

  function updateHistory(aHistory, anImageUrl) {
    var imageHtml;
    var historyListHtml = "";
    if (anImageUrl) {
      aHistory.push(anImageUrl);
    }
    // stringify converts [ el1, el2 ,el3]  to  '[ el1, el2 ,el3]' (a JSON)
    clientHistoryString = JSON.stringify(aHistory);
    // document.cookie writes the string to the cookie
    document.cookie = clientHistoryString;
    // loop through history
    for (var i = 0; i < aHistory.length; i++) {
      var imageUrl = aHistory[i];
      imageHtml = '<div class="history-image"><img src="' + imageUrl + '" /></div>';
      // concatenates latest image html with growing list of historyListHtml
      historyListHtml = imageHtml + historyListHtml;
    }
    // insert history list to history-content div
    document.getElementById('history-content').innerHTML = historyListHtml;
    // loop through the images currently on history page
    var historyImages = document.getElementsByClassName('history-image');
    for (var j = 0; j < historyImages.length; j++) {
      // target first child of div, which is an img
      var thisImg = historyImages[j].firstChild;
      // add a click listener , which changes background to that image
      thisImg.addEventListener('click', changeBackgroundTo(thisImg));
    }
  }


  // defining a client history string, which is a stringified empty array

  var clientHistoryString = "[]";

  function clearHistory() {
    clientHistory = [];
    updateHistory(clientHistory);
  }

  // if a cookie exists and takes the right form, then populate the history section

  if (document.cookie.substr(0, 2) === '["') {
    clientHistoryString = document.cookie;
  }

  var clientHistory = JSON.parse(clientHistoryString);
  updateHistory(clientHistory);


  // Check whether user is logged into instagram

  var newAccessKey = window.location.hash.slice(1);
  if (newAccessKey.slice(0, 13) !== "access_token=") {
    window.location = "https://instagram.com/oauth/authorize/?client_id=d80c733cf6c9474e8df5daffc9a9a2b7&redirect_uri=http://kat4.github.io/instaground&response_type=token";
  }

  // Request images from instagram

  function jsonp(callback) {
    //get the search term from user
    var searchTag = document.getElementById('search-field').value;
    //handle cases with two words by joining them together
    searchTag = searchTag.split(" ").join("");
    //build the api request url using the search term and accesskey
    var url = 'https://api.instagram.com/v1/tags/' + searchTag + '/media/recent?' + newAccessKey;
    //create a unique callback id for each http request so we delete the correct script tag later
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    //delete script tags created by jsonp request so as to not clutter the html
    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      //and calls the callback function displayRandomImage (which displays a random image on the page as a background) on the response(data) given back which is a JSON object
      callback(data);
    };
    // creating a script tag with the request to send to instagram which executes (how does this happen?)
    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
  }

  // Callback function
  function displayRandomImage(response) {
    var randomImageNum = Math.floor(Math.random() * 20);
    if (typeof response.data[randomImageNum] === "undefined") {

      (changeContentTab(2))();
    } else {
      var randomImageUrl = response.data[randomImageNum].images.standard_resolution.url;
      document.getElementById('download').href = randomImageUrl;
      document.getElementById('background-container').style.backgroundImage = 'url("' + randomImageUrl + '")';
      updateHistory(clientHistory, randomImageUrl);
    }
  }
  //adding click handlers to the tabs and toggling between the tabbed content
  function makeClickHandlers() {
    //declaring the arrays and variables to loop through them
    var elems_array = document.getElementsByClassName("tab"),
      i;

    //if you click on a tab then.. (see line 110 onwards)
    for (i = 0; i < elems_array.length; i++) {
      elems_array[i].addEventListener("click", changeContentTab(i));
    }
  }
  //if you click on a tab then.. if that clicked tab has the same index as the tabbed content then display that one and loop through and hide the others.
  function changeContentTab(i) {
    return function() {
      var tab_content = document.getElementsByClassName("tab-content"),
        j;
      for (j = 0; j < tab_content.length; j++)
        if (i != j) {
          document.getElementsByClassName("tab-content")[j].style.display = "none";
        } else {
          document.getElementsByClassName("tab-content")[j].style.display = "block";
        }
    };
  }

  return {
    jsonp: jsonp,
    displayRandomImage: displayRandomImage,
    makeClickHandlers: makeClickHandlers,
    clearHistory: clearHistory,
    changeContentTab: changeContentTab
  };

}());

// Search on enter key
var searchField = document.getElementById('search-field');
searchField.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    (instaground.changeContentTab(0))();
    instaground.jsonp(instaground.displayRandomImage);
  }
});

var clearHistoryButton = document.getElementById('clear-history');
clearHistoryButton.addEventListener("click", instaground.clearHistory);

instaground.makeClickHandlers();

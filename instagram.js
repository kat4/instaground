var newAccessKey = window.location.hash.slice(1);
if (newAccessKey.slice(0,13) !== "access_token="){
window.location = "https://instagram.com/oauth/authorize/?client_id=d80c733cf6c9474e8df5daffc9a9a2b7&redirect_uri=http://kat4.github.io/instaground&response_type=token";
}
//
// var newURL = "https://api.instagram.com/v1/media/popular?" + newAccessKey;
//     function httpGetAsync(theUrl, callback) {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() {
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//             callback(xmlHttp.responseText);
//     }
//     xmlHttp.open("GET", theUrl, true); // true for asynchronous
//     xmlHttp.send(null);
// }
//
//   httpGetAsync(newURL, function() {console.log("Succes")})


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

function displayRandomImage(response) {
  var randomImageNum = Math.floor(Math.random() * 20);
  var randomImageUrl = response.data[randomImageNum].images.standard_resolution.url;
  document.getElementById('main-ground-container').innerHTML = '<div style="width:640px;height:640px;background-image:url(' + randomImageUrl + '); background-size:cover; background-position:center;"></div>';
}

var searchButton = document.getElementById('search-button');
searchButton.addEventListener('onclick', function() { jsonp(displayRandomImage);});

var searchField = document.getElementById('search-field');
searchField.addEventListener('keydown', function(e) {
  if(e.keyCode === 13) {
    jsonp(displayRandomImage);
  }
}
);
// get key presses only when the textfield is being edited

//searchField.addEventListener(KeyboardEvent.KEY_DOWN, handler);

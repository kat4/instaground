var newAccessKey = window.location.hash.slice(1);
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
  //var searchterm = document.getElementById('searchTermInput').value.toString() || document.getElementById('searchTermInput').placeholder;
  var url = 'https://api.instagram.com/v1/tags/' + 'autumn' + '/media/recent?' + newAccessKey;
  var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  window[callbackName] = function(data) {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
    console.log(data)
  };

  var script = document.createElement('script');
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
  document.body.appendChild(script);
}


jsonp(function() {
  console.log('Success')
})

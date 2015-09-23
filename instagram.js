
var test_images = JSON.parse(response.json);
var randomImageNum = Math.floor(Math.random()*20);
var randomImageUrl = test_images.data[randomImageNum].images.standard_resolution.url;

document.getElementById('main-ground-container').innerHTML='<div style="width:100%;height:100%;background-image:url('+randomImageUrl+'); background-size:cover; background-position:center;"></div>';

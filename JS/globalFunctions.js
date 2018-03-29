function preload(urls, onFinished) {
  load.style.visibility = "visible";
  var counter = urls.length;
  var callback = function() {
    counter--;
    if( counter == 0 ) {
      load.style.visibility = "hidden";
      onFinished();
    }
  }
  for (var i = 0; i < urls.length; i++) {
    var img = new Image();
    img.onload = callback;
    img.src = urls[i]
  }
}

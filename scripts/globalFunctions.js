export function preload(urls, onFinished) {
  load.style.visibility = 'visible';
  let counter = urls.length;
  const callback = function() {
    counter--;
    if ( counter == 0 ) {
      load.style.visibility = "hidden";
      onFinished();
    }
  }
  for (let i = 0; i < urls.length; i++) {
    const img = new Image();
    img.onload = callback;
    img.onerror = function() {console.error('error loading '+ urls[i])}
    img.src = urls[i];
  }
}

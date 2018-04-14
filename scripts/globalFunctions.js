export function elem(elemId) {
  return document.getElementById(elemId);
}
export function preload(urls, onFinished) {
  elem('load').style.visibility = 'visible';
  let counter = urls.length;
  const callback = function () {
    counter -= 1;
    if (counter === 0) {
      elem('load').style.visibility = 'hidden';
      onFinished();
    }
  };
  for (let i = 0; i < urls.length; i += 1) {
    const img = new Image();
    img.onload = callback;
    img.onerror = function () {
      console.error(`error loading ${urls[i]}`);
      preload(urls, onFinished);
    };
    img.src = urls[i];
  }
}

'use strict';

//export default function
export default function preload(urls, onFinished) {
  load.style.visibility = 'visible';
  let counter = urls.length;
  const callback = function() {
    counter--;
    console.log ('осталось загрузить: ' + counter);
    if ( counter == 0 ) {
      load.style.visibility = "hidden";
      onFinished();
    }
  }
  for (let i = 0; i < urls.length; i++) {
    const img = new Image();
    img.onload = callback;
    console.log ('файлов для кэширования: ' + urls.length);
    img.onerror = function() {console.log('ошибка загрузки, попробуем ещё раз'); };
    img.src = urls[i]
  }
}

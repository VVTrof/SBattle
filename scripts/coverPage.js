import { preload, elem } from './globalFunctions.js';
import { lvlChange } from './data/dataVariable.js';
import game from './gamePage.js';
// функции:
// визуализирует объекты титульной страницы
function visualCoverPage() {
  elem('titulPage').style.visibility = 'visible';
  elem('fonTitulPage').style.zIndex = 1;
  elem('buttonStart').style.zIndex = 2;
  elem('buttonOff').style.zIndex = 2;
  elem('buttonUp').style.zIndex = 2;
  elem('buttonDown').style.zIndex = 2;
  elem('infoGame').style.zIndex = 2;
  elem('infoGame').style.opacity = 0;
  elem('beginLvl').style.zIndex = 3;
  elem('buttonRules').style.zIndex = 3;
  elem('buttonInfo').style.zIndex = 3;
  elem('indLvlTitul').style.zIndex = 3;
}
// скрывает объекты титульной страницы
function hideCoverPage() {
  elem('titulPage').style.visibility = 'hidden';
}
// coverPageProcess();
function coverPageProcess() {
  // создаём список кэшируемых картинок
  // для исключения повторного нажатия на кнопки buttonRules и buttonInfo
  let lastClick;
  visualCoverPage();
  // функции-обработчики кнопок
  elem('buttonRules').onclick = function () {
    let currentOpacity = +elem('infoGame').style.opacity;
    let directionOpacity = 'reduction';
    if (lastClick !== 'rules') {
      elem('buttonRules').src = 'images/buttons/buttonRulesOn.png';
      elem('buttonInfo').src = 'images/buttons/buttonInfoOff.png';
      // плавно убирает и выводит окно infoGame
      const timer = setInterval(() => {
        if (currentOpacity > 0 && directionOpacity === 'reduction') {
          currentOpacity -= 0.01;
        }
        if (currentOpacity < 0.7 && directionOpacity === 'increase') {
          currentOpacity += 0.01;
        }
        if (currentOpacity >= 0.7 && directionOpacity === 'increase') {
          clearInterval(timer);
        }
        if (currentOpacity <= 0.01 && directionOpacity === 'reduction') {
          directionOpacity = 'increase';
          elem('infoGame').innerText =
            'Вы управляете подводной лодкой. ' +
            'В Вашем распоряжении три торпедных аппарата и 300 торпед ' +
            'боекомплекта. ' +
            'Запуск торпед производится путём нажатия клавиш "z", "x" и "c" ' +
            'поворот перископа - клавиши "left"  и "right"';
        }
        elem('infoGame').style.opacity = currentOpacity;
      }, 10);
      lastClick = 'rules';
    }
  };
  elem('buttonInfo').onclick = function () {
    let currentOpacity = +elem('infoGame').style.opacity;
    let directionOpacity = 'reduction';
    if (lastClick !== 'info') {
      elem('buttonRules').src = 'images/buttons/buttonRulesOff.png';
      elem('buttonInfo').src = 'images/buttons/buttonInfoOn.png';
      // плавно убирает и выводит окно infoGame
      const timer = setInterval(() => {
        if (currentOpacity > 0 && directionOpacity === 'reduction') {
          currentOpacity -= 0.01;
        }
        if (currentOpacity < 0.7 && directionOpacity === 'increase') {
          currentOpacity += 0.01;
        }
        if (currentOpacity >= 0.7 && directionOpacity === 'increase') {
          clearInterval(timer);
        }
        if (currentOpacity <= 0.01 && directionOpacity === 'reduction') {
          directionOpacity = 'increase';
          elem('infoGame').innerText = 'последние изменения:' +
           'три торпедных аппарата, количество кораблей до шести (можно' +
           'увеличить) \n сейчас работаю над: алгоритм проверки попадания,' +
           'вывод кораблей на модуль сонар. \n предложения и пожелания можно' +
           'отправить на почту: vvtrof@gmail.com';
        }
        elem('infoGame').style.opacity = currentOpacity;
      }, 10);
      lastClick = 'info';
    }
  };
  elem('buttonOff').onclick = function () {
    /* eslint-disable */
    const result = confirm('Вы хотите покинуть игру?');
    /* eslint-enable */
    if (result === true) window.close();
  };
  elem('buttonUp').onclick = function () {
    if (lvlChange().current < 2) {
      lvlChange().up();
    }
    elem('beginLvl').innerText = `${lvlChange().current} level`;
  };
  elem('buttonDown').onclick = function () {
    if (lvlChange().current > 0) {
      lvlChange().down();
    }
    elem('beginLvl').innerText = `${lvlChange().current} level`;
  };
  elem('buttonStart').onclick = function () {
    hideCoverPage();
    // Будут направления: в ангар, на базу и на карту
    // задаем миссию и номер пл
    // будет в дальнейшем меняться
    // nSub = 1;
    game();
  };
}
// функция выполнения титульной страницы
export default function coverPage() {
  const coverPageCache = [
    'images/fonTitulPage.jpg',
    'images/buttons/buttonStart.png',
    'images/buttons/buttonOff.png',
    'images/buttons/buttonUp.png',
    'images/buttons/buttonDown.png',
    'images/buttons/buttonInfoOff.png',
    'images/buttons/buttonRulesOff.png',
    'images/indikator.png',
  ];
    // кэшируем картинки
  preload(coverPageCache, coverPageProcess);
}

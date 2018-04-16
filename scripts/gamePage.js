import { preload, elem } from './globalFunctions.js';
import {
  FRAME_RATE, warShipProto, TORPED_WIDTH,
  TORPED_HEIGHT, X_MIN, X_MAX, Y_MAX, lvlChange, TORPEDO_START_Y,
  nSubChange, SPEED_LID,
} from './data/dataVariable.js';
import techParam from './data/dataSubmarine.js';
import level from './data/dataLevels.js';

const lvl = lvlChange().current;
const nSub = nSubChange().current;
const lvlGame = Object.create(level[lvl]);
const subParam = techParam[nSub];
let pozitionPeriscope = 0;
let perMouseLeft = false; // используется в обработчике поворот перископа
let perMouseRight = false; // используется в обработчике поворот перископа
let delayNewShip = 0; // счетчик задержки появления нового корабля
let offset1 = 0; // анимация моря
let offset2 = -50; // анимация моря
let directionOffset1 = 'reduction'; // анимация моря
let directionOffset2 = 'increase'; // анимация моря
// объекты "торпеды"
// x: "координата X (левый край торпеды)",
// y: "координата Y (верхний край торпеды)",
// width: "ширина торпеды",
//  height: "длина торпеды",
//  speed: "скорость торпеды",
//  visible: "видимость торпеды (true/false)",
//  rangeFactor: "коэффициент для расчета размера объекта в зависимости от его
// дальности от ПЛ (от 1 до 0.1)",
//  accelerator: "изменение скорости торпеды в зависимости от применения
// модулей улучшения 1 - 100%"
const torped = subParam.tubes.map(tube => ({
  x: tube.x,
  y: TORPEDO_START_Y,
  width: TORPED_WIDTH,
  height: TORPED_HEIGHT,
  speed: tube.speed,
  visible: false,
  rangeFactor: 1,
  accelerator: 1,
}));
let shipsDestroy = 0; // уничтожено кораблей в этом уровне
let shipsOnScreen = 0; // текущее количество кораблей на экране
const sh = []; // массив кораблей, отображенных на экране
// функция определения существующих кораблей с данной координатой y
function shipsOnLine(validationY) {
  const shipsOnLineReturn = [];
  sh.forEach((ship, nShipOnScreen) => {
    if (Math.floor(ship.y) === Math.floor(validationY)) {
      shipsOnLineReturn.push(nShipOnScreen);
    }
  });
  return shipsOnLineReturn;
}
// функция проверки на столкновения кораблей. аргументами задаются: проверяемый
// корабль, предполагаемое смещение по X и по Y
function validation(vShip, vShiftX, vShiftY) {
  // кол-во кораблей на предполагаемой новой линии
  const interference = shipsOnLine(vShip.y + vShiftY);
  // результат проверки
  let result = false;
  // перебираем все корабли на этой линии
  interference.forEach((vSh2) => {
    let safetyDistance;
    // определяем безопасную дистанцию (ширина большего из кораблей + 10%)
    if (vShip.currentWidth > sh[vSh2].currentWidth) {
      safetyDistance = vShip.currentWidth * 1.1;
    } else {
      safetyDistance = sh[vSh2].currentWidth * 1.1;
    }
    // проверка для всех кораблей на линии кроме себя самого с собой
    if (vShip !== sh[vSh2]) {
      if (Math.abs((vShip.x + vShiftX) - sh[vSh2].x) < safetyDistance) {
        result = true; console.log("boom!");
        console.log(vShip);console.log(sh[vSh2]);
      }
    }
  });
  return result;
}
// запуск торпед
function startTorpedo(nTube) {
  const tube = subParam.tubes[nTube];
  const torpedo = torped[nTube];
  const indTubeId =
    ['indLeftTorpedText', 'indCenterTorpedText', 'indRightTorpedText'][nTube];
  const indTube = document.getElementById(indTubeId);
  if ((torpedo.y === TORPEDO_START_Y) && (tube.torpeds > 0)) {
    torpedo.y = TORPEDO_START_Y - 1;
    torpedo.x = tube.x + pozitionPeriscope;
    // списываем одну торпеду
    tube.torpeds -= 1;
    // делаем торпеду видимой
    torpedo.visible = true;
    // вывожу на экран кол-во торпед
    indTube.innerText = tube.torpeds;
    // меняю цвет индикатора запуска торпеды
    indTube.style.background = 'red';
  }
}
// преобразует данные о повороте перископа (от -300 до 300) в градусы (300-60)
function conversionPozperiscope(pozPeriscope) {
  let pozPeriscopeDegree;
  if (pozPeriscope >= 0) {
    pozPeriscopeDegree = pozitionPeriscope / 5;
  }
  if (pozPeriscope < 0) {
    pozPeriscopeDegree = (pozitionPeriscope / 5) + 360;
  }
  return pozPeriscopeDegree;
}
// удаление объекта и элемента img
function deleteObj(index) {
  const deletingElement = elem(`ship${index}`);
  elem('gamePage').removeChild(deletingElement);
  // уменьшаем  счётчик кораблей на экране`ship${`ship${index}`}`
  shipsOnScreen -= 1;
  delete sh[index];
}
// функция паузы в игре
function pause() {
  alert('игра приостановлена. продолжить?');
  return false;
}
// возвращает целое число из выбранного диапозоза
function getRandomInRange(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}
// возвращает число с плавающей точкой из выбранного диапозоза
function getRandomFloat(min, max) {
  return (Math.random() * (max - min)) + min;
}
// возвращает true или false
function rndTrue() {
  return (Math.floor(Math.random() * 2) === 0);
}
// функция поворота перископа
function rotatePeriscope(direction) {
  if (direction === 'left') {
    if (pozitionPeriscope > -300) {
      pozitionPeriscope -= 1 * subParam.speedRotateperiscope;
      if (pozitionPeriscope < -300) {
        pozitionPeriscope = -300;
      }
    }
  }
  if (direction === 'right') {
    if (pozitionPeriscope < 300) {
      pozitionPeriscope += 1 * subParam.speedRotateperiscope;
      if (pozitionPeriscope > 300) {
        pozitionPeriscope = 300;
      }
    }
  }
  // выводим значение поворота перископа
  elem('indRotatePerText').innerText =
    `${conversionPozperiscope(pozitionPeriscope)}  °`;
  // анимация неба
  elem('sky').style.left = -100 - (pozitionPeriscope / 3);
  // анимация суши
  elem('land').style.left = -300 - pozitionPeriscope;
  return pozitionPeriscope;
}
// получение объекта событие, поворот перископа, запуск торпед.
function selector(e) {
  // Получаем keyCode:
  const { keyCode: kCode } = e;
  // const keyCode = e.keyCode;
  if (kCode === 80) { pause(); }
  // поворот перископа влево до значения -300
  if (kCode === 37) { pozitionPeriscope = rotatePeriscope('left'); }
  // поворот перископа вправо до значения 300
  if (kCode === 39) { pozitionPeriscope = rotatePeriscope('right'); }
  // запуск левой торпеды
  if (kCode === 90) { startTorpedo(0); }
  // запуск центральной торпеды
  if (kCode === 88) { startTorpedo(1); }
  // запуск правой торпеды
  if (kCode === 67) { startTorpedo(2); }
  // Отменяем действие по умолчанию:
  e.preventDefault();
  e.returnValue = false;
  return false;
}
// создание объекта и элемента выплывающего корабля по прототипу корабля
function createShip(NShip, typeShip) {
  // индикатор (true - найдена подходящая координата 'y' для нового корабля)
  let suitableY = false;
  // временная переменная
  const tempRnd = getRandomInRange(0, 100);
  // создаём объект корабль
  sh[NShip] = Object.create(warShipProto[typeShip]);
  // выбираем направление движения корабля
  if (getRandomInRange(1, 100) <= lvlGame.directionShips) {
    sh[NShip].vectorLeft = true;
  } else { sh[NShip].vectorLeft = false; }
  // определяем координату Y
  while (suitableY !== true) {
    const randomY = getRandomInRange(lvlGame.shipMinY, lvlGame.shipMaxY);
    const ships = shipsOnLine(randomY);
    let concurrences = false;
    // проверяем существует ли уже корабль на выбранной координате
    ships.forEach((numberShip) => {
      const newShip = sh[NShip];
      const checkedShip = sh[numberShip];
      if (newShip.vectorLeft && checkedShip.x < X_MIN) { concurrences = true; }
      if ((newShip.vectorLeft === false) &&
        (checkedShip.x + checkedShip.currentWidth > X_MAX)) {
        concurrences = true;
      }
    });
    if (concurrences === false) {
      suitableY = true; sh[NShip].y = randomY;
    } else { suitableY = false; }
  }
  // расчет коэффициента размера кораблей
  sh[NShip].rangeFactor = 1 - ((Y_MAX - sh[NShip].y) * 0.0025);
  // расчет коэффициента скорости кораблей в зависимости от дальности
  sh[NShip].speedFactor = 1 - ((lvlGame.shipMaxY - sh[NShip].y) * 0.0025);
  // расчет размеров корабля для визуализации
  sh[NShip].currentWidth = sh[NShip].width * sh[NShip].rangeFactor;
  sh[NShip].currentHeight = sh[NShip].height * sh[NShip].rangeFactor;
  // определяем координату X
  if (sh[NShip].vectorLeft) {
    sh[NShip].x = X_MIN - sh[NShip].currentWidth;
    sh[NShip].src = sh[NShip].srcOnLeft;
  } else {
    sh[NShip].x = X_MAX;
    sh[NShip].src = sh[NShip].srcOnRight;
  }
  // горизонтальная cкорость корабля (RND в пределах данных уровня умноженный
  // на коэфицент выбранного корабля и на коф дальности)
  sh[NShip].speedX =
    getRandomFloat(lvlGame.speedShipsMin, lvlGame.speedShipsMax);
  if (sh[NShip].vectorLeft === false) { sh[NShip].speedX = -sh[NShip].speedX; }
  // вертикальная скорость корабля
  sh[NShip].speedY =
      getRandomFloat(lvlGame.speedShipsMinY, lvlGame.speedShipsMaxY);
  if (rndTrue()) { sh[NShip].speedY = -sh[NShip].speedY; }
  // определяем тип движения корабля
  if (tempRnd <= lvlGame.shipsType[0]) {
    sh[NShip].typeMooving = 'simple';
    sh[NShip].speedY = 0;
  }
  if ((tempRnd > lvlGame.shipsType[0]) && (tempRnd <= lvlGame.shipsType[1])) {
    sh[NShip].typeMooving = 'zigzag';
  }
  if ((tempRnd > lvlGame.shipsType[1]) && (tempRnd <= lvlGame.shipsType[2])) {
    sh[NShip].typeMooving = 'hard';
    // выбор любимой линии корабля
    sh[NShip].favoriteLine =
      getRandomInRange(lvlGame.shipMinY, lvlGame.shipMaxY);
  }
  console.log(tempRnd);
  console.log(sh[NShip].typeMooving);
  // отнимаем корабль выбранного типа из базы уровня
  lvlGame.warShip[typeShip] -= 1;
  // увеличиваем значение счётчика кораблей на экране
  shipsOnScreen += 1;
  // сбрасываем счётчик паузы до появления следующего корабля
  delayNewShip = 0;
  // счетчик оставшихся кораблей
  lvlGame.numberOfShips -= 1;
  // задаём характеристики элементу
  // создаём элемент корабль
  const image = document.createElement('img');
  image.className = 'ships';
  image.id = `ship${NShip}`;
  elem('gamePage').appendChild(image);
}
// визуализируем торпеды
function torpedsElementVisual() {
  const torpedsImg = [
    elem('leftTorped'),
    elem('centerTorped'),
    elem('rightTorped'),
  ];
  torpedsImg.forEach((torpedoImg, nTorpedo) => {
    if (torped[nTorpedo].visible) {
      torpedoImg.style.top = torped[nTorpedo].y;
      torpedoImg.style.left = (torped[nTorpedo].x - pozitionPeriscope) +
        ((TORPED_WIDTH - torped[nTorpedo].width) / 2);
      torpedoImg.style.width = torped[nTorpedo].width;
      torpedoImg.style.height = torped[nTorpedo].height;
    }
  });
}
// визуализируем кораблики
function shipElementVisual(nShip) {
  // console.log (nShip);
  const elementId = `ship${nShip}`;
  const shipElement = document.getElementById(elementId);
  // const y = Math.floor(sh[nShip].y);
  shipElement.src = sh[nShip].src;
  shipElement.style.top = Math.floor(sh[nShip].y);
  shipElement.style.left = sh[nShip].x - pozitionPeriscope;
  shipElement.style.zIndex =
    Math.floor(sh[nShip].y) + Math.floor(sh[nShip].currentHeight);
  shipElement.style.width = sh[nShip].currentWidth;
  shipElement.style.height = sh[nShip].currentHeight;
}
// визуализируем объекты игровой страницы
function visualGamePage() {
  elem('gamePage').style.visibility = 'visible';
  elem('lid').style.zIndex = 819;
  elem('lid2').style.zIndex = 819;
  elem('sea1').style.zIndex = 2;
  elem('sea1').style.opacity = 1;
  elem('sea2').style.zIndex = 3;
  elem('sea2').style.opacity = 0.5;
  elem('periscope').style.zIndex = 820;
  elem('crosshair').style.zIndex = 820;
  elem('crosshair').style.opacity = 0.5;
  elem('panel').style.zIndex = 820;
  elem('sky').style.zIndex = 5;
  elem('sky').style.left = -75;
  elem('land').style.zIndex = 6;
  elem('land').style.left = -300;
  elem('indRotateperiscope').style.zIndex = 821;
  elem('indLeftTorped').style.zIndex = 821;
  elem('indCenterTorped').style.zIndex = 821;
  elem('indRightTorped').style.zIndex = 821;
  elem('indLeftTorpedText').style.zIndex = 821;
  elem('indCenterTorpedText').style.zIndex = 821;
  elem('indRightTorpedText').style.zIndex = 821;
  elem('indRotatePerText').style.zIndex = 821;
  elem('leftTorped').style.zIndex = 4;
  elem('leftTorped').style.opacity = 0.8;
  elem('centerTorped').style.zIndex = 4;
  elem('centerTorped').style.opacity = 0.8;
  elem('rightTorped').style.zIndex = 4;
  elem('rightTorped').style.opacity = 0.8;
  elem('buttonPerLeft').style.zIndex = 822;
  elem('buttonPerRight').style.zIndex = 824;
  elem('sonar').style.zIndex = 824;
  elem('radio').style.zIndex = 824;
  elem('pribor').style.zIndex = 824;
  elem('indikatorDos').style.zIndex = 824;
  // визуализация кол-ва оставшихся торпед
  elem('indLeftTorpedText').innerText = subParam.tubes[0].torpeds;
  elem('indCenterTorpedText').innerText = subParam.tubes[1].torpeds;
  elem('indRightTorpedText').innerText = subParam.tubes[2].torpeds;
}
// открытие и закрытие перископа
function lidMove(open) {
  let lidY;
  let lid2Y;
  if (open) { lidY = 0; lid2Y = Y_MAX / 2; } else {
    lidY = -Y_MAX * 0.375; lid2Y = Y_MAX * 0.875;
  }
  const timerLid = setInterval(() => {
    if (open) {
      if (lidY > -Y_MAX * 0.375) {
        lidY -= 2;
        lid2Y += 2;
      } else {
        clearTimeout(timerLid);
      }
    }
    if (open === false) {
      if (lidY > 0) {
        lidY += 2;
        lid2Y -= 2;
      } else {
        clearTimeout(timerLid);
      }
    }
    elem('lid').style.top = lidY;
    elem('lid2').style.top = lid2Y;
  }, SPEED_LID);
}

// функция игрового процесса
function gameProcess() {
  elem('sea1').src = lvlGame.seaSrc;
  elem('sea2').src = lvlGame.seaSrc;
  elem('sky').src = lvlGame.skySrc;
  elem('land').src = lvlGame.landSrc;
  // визуализируем объекты игровой страницы
  visualGamePage();
  //  поднимаем перископ
  lidMove(true);
  // игровой процесc
  const timerGame = setInterval(() => {
    delayNewShip += 1;
    // делаем новый корабль если пауза до появления следующего корабля
    // соблюдена, кораблей на экране меньше,
    // чем задано по уровню и если выплыли ещё не все корабли
    if ((delayNewShip > lvlGame.delayNewShip - (lvlGame.delayNewShipReduction *
       shipsDestroy)) &&
       (shipsOnScreen < lvlGame.maxShips) && (lvlGame.numberOfShips > 0)) {
      let numberCreatingShip;
      // выбираем RND способом тип корабля в зависимости от данных тек. уровня
      let changeShip = getRandomInRange(1, lvlGame.numberOfShips);
      let changeTypeShip = 'empty'; // выбранный случайным образом тип корабля
      // создаём корабль
      // выбираем тип корабля из оставшихся в данном уровне
      lvlGame.warShip.forEach((ships, shipType) => {
        if ((ships >= changeShip) && (changeTypeShip === 'empty')) {
          changeTypeShip = shipType;
        }
        changeShip -= ships;
      });
      // ищем 'свободное место' для корабля от 1-го до lvlGame.maxShips
      for (let i = lvlGame.maxShips - 1; i >= 0; i -= 1) {
        if (typeof sh[i] !== 'object') { numberCreatingShip = i; }
      }
      // создаём корабль
      createShip(numberCreatingShip, changeTypeShip);
      // console.log(`созданный корабль${sh[numberCreatingShip]}`);
    }

    // Устанавливаем обработчик для событий клавиатуры
    document.onkeydown = selector;
    // обработчики событий мышки
    elem('sonar').onclick = () => { pause(); };
    elem('indRightTorpedText').onclick = () => { startTorpedo(2); };
    elem('indLeftTorpedText').onclick = () => { startTorpedo(0); };
    elem('indCenterTorpedText').onclick = () => { startTorpedo(1); };
    elem('buttonPerLeft').onmousedown = () => { perMouseLeft = true; };
    elem('buttonPerLeft').onmouseup = () => { perMouseLeft = false; };
    elem('buttonPerLeft').onmouseout = () => { perMouseLeft = false; };
    elem('buttonPerRight').onmousedown = () => { perMouseRight = true; };
    elem('buttonPerRight').onmouseup = () => { perMouseRight = false; };
    elem('buttonPerRight').onmouseout = () => { perMouseRight = false; };

    // анимация моря
    if ((offset1 >= -50) && (directionOffset1 === 'reduction')) {
      offset1 -= 0.1;
    }
    if ((offset1 <= 0) && (directionOffset1 === 'increase')) {
      offset1 += 0.1;
    }
    if (offset1 >= 0) { directionOffset1 = 'reduction'; }
    if (offset1 <= -50) { directionOffset1 = 'increase'; }
    if ((offset2 >= -50) && (directionOffset2 === 'reduction')) {
      offset2 -= 0.1;
    }
    if ((offset2 <= 0) && (directionOffset2 === 'increase')) {
      offset2 += 0.1;
    }
    if (offset2 >= 0) { directionOffset2 = 'reduction'; }
    if (offset2 <= -50) { directionOffset2 = 'increase'; }
    elem('sea1').style.left = (-subParam.maxRotateperiscope + offset1)
      - pozitionPeriscope;
    elem('sea2').style.left = (-subParam.maxRotateperiscope + offset2)
      - pozitionPeriscope;

    // цвет индикаторов торпед
    if (torped[0].y === TORPEDO_START_Y) {
      elem('indLeftTorpedText').style.background = 'lightblue';
    }
    if (torped[1].y === TORPEDO_START_Y) {
      elem('indCenterTorpedText').style.background = 'lightblue';
    }
    if (torped[2].y === TORPEDO_START_Y) {
      elem('indRightTorpedText').style.background = 'lightblue';
    }

    // движение перископа по нажатию мыши
    if (perMouseLeft) {
      pozitionPeriscope = rotatePeriscope('left');
    }
    if (perMouseRight) {
      pozitionPeriscope = rotatePeriscope('right');
    }
    // рассчет полета торпед, визуализация торпед
    torped.forEach((torpedo) => {
      if (torpedo.visible) {
        // коэффиц. который зависит от удаленности торпеды (от 1 до 0.25)
        torpedo.rangeFactor = 1 - ((TORPEDO_START_Y - torpedo.y) * 0.0025);
        // если торпеда рядом с горизонтом - увеличиваем её прозрачность
        if (torpedo.y < lvlGame.gorizontY - 80) {
          torpedo.opacity = 0.4;
        } else {
          torpedo.opacity = 0.8;
        }
        // определяем размеры торпед в зависимости от удаленности
        torpedo.width = TORPED_WIDTH * torpedo.rangeFactor;
        torpedo.height = TORPED_HEIGHT * torpedo.rangeFactor;
        // если торпеда выпущена перемещаем её
        if (torpedo.y < TORPEDO_START_Y) {
          torpedo.y -= (torpedo.speed * torpedo.rangeFactor);
        }
        // возвращаем торпеду в торпедный аппарат при y<450
        if (torpedo.y < 450 - torpedo.height) {
          torpedo.y = TORPEDO_START_Y;
        }
        // если торпеда ушла за горизонт делаем её невидимой
        if (torpedo.y < lvlGame.gorizontY - torpedo.height) {
          torpedo.visible = false;
        }
        // если торпеда попала в цель делаем её невидимой
        // ---------------------------прописать
        // вызов функции визуализации торпед
        if (torpedo.visible) { torpedsElementVisual(); }
      }
    });
    // рассчет движения кораблей, визуализация кораблей
    sh.forEach((ship, nShipOnScreen) => {
      if (typeof ship === 'object') {
        let shiftX; // изменение координат по x
        let shiftY; // изменение координат по y
        let resultOfChecking = false; // результат проверки на столкновения
        // расчет коэффициента размера кораблей
        ship.rangeFactor = 1 - ((Y_MAX - ship.y) * 0.0025);
        // расчет размеров корабля для визуализации
        ship.currentWidth = ship.width * ship.rangeFactor;
        ship.currentHeight = ship.height * ship.rangeFactor;
        // расчет коэффициента скорости кораблей в зависимости от дальности
        ship.speedFactor = 1 - ((lvlGame.shipMaxY - ship.y) * 0.0025);
        // поведение корабля
        // достижение края зоны по Y
        if ((ship.y > lvlGame.shipMaxY) || (ship.y < lvlGame.shipMinY)) {
          ship.speedY = -ship.speedY;
        }
        // если тип движения hard и достигнута любимая линия, то скорость Y
        // временно будет равно 0
        if ((ship.typeMooving === 'hard') &&
          (ship.favoriteLine === Math.floor(ship.y))) {
          ship.timeVariationSpeedY = 0;
          if (getRandomFloat(0, 100) < lvlGame.hardLetsGo) {
            ship.timeVariationSpeedY = 1;
          }
        }
        // предполагаемое смещение кораблей учётом ускорения от подбитых целей

        // проверка на столкновения при 1-ом сценарии (движение по маршруту)
        shiftX = ship.speedX * (1 + (lvlGame.speedShipsMaxIncrease *
          shipsDestroy)) * ship.speedFactor * ship.timeVariationSpeedX;
        shiftY = ship.speedY * ship.timeVariationSpeedY;
        resultOfChecking = validation(ship, shiftX, shiftY);
        // если возможно столкновение проверяем 2-ой сценари
        // меняем вертикальную скорость на противоположную
        if (resultOfChecking) {
          shiftY = -shiftY;
          resultOfChecking = validation(ship, shiftX, shiftY);
          if (resultOfChecking === false) { ship.speedY = -ship.speedY; }
        }
        // если возможно столкновение проверяем 3-ий сценарий
        // (прекращаем движение по вертикали)
        if (resultOfChecking) {
          shiftY = 0;
          resultOfChecking = validation(ship, shiftX, shiftY);
        }
        // (если движение по вертикали не было пробуем изменить Y на 1)
        // вариант, когда корабли идут на таран или догоняют друг друга
        if (resultOfChecking) {
          // пробуем оплыть по низу
          shiftY = 1;
          resultOfChecking = validation(ship, shiftX, shiftY);
          // пробуем оплыть по верху
          if (resultOfChecking) {
            shiftY = -1;
            resultOfChecking = validation(ship, shiftX, shiftY);
          }
          // если не получается - возвращаем значение shiftY
          // остонавливаем корабль
          if (resultOfChecking) { shiftY = 0; shiftX = 0; }
        }
        ship.x += shiftX;
        ship.y += shiftY;
        // вызов функции визуализации кораблей
        shipElementVisual(nShipOnScreen);
        // проверка уход за край, удаление объекта если он вне видимости ПЛ,
        if ((ship.x > X_MAX) || (ship.x < X_MIN - ship.currentWidth)) {
          deleteObj(nShipOnScreen);
        }
      }
    });
  }, FRAME_RATE);
}
// Запуск игры, кэширование
export default function game() {
  const levelGame = lvlChange().current;
  elem('load').style.visibility = 'visible';
  // кэш игровой страницы
  const gameCache = [level[levelGame].seaSrc,
    level[levelGame].skySrc,
    level[levelGame].landSrc,
  ];
  // добавляем в кэш изображения кораблей
  level[lvl].warShip.forEach((ships, index) => {
    const dataSrc = warShipProto[index];
    if (ships > 0) {
      gameCache.push(dataSrc.srcOnLeft);
      gameCache.push(dataSrc.srcOnLeft);
      gameCache.push(dataSrc.destroySrc);
      gameCache.push(dataSrc.fireSrc);
      gameCache.push(dataSrc.destroyRevSrc);
    }
  });
  // запуск функции кэширования изображений
  preload(gameCache, gameProcess);
}

import { preload } from './globalFunctions.js';
import { SHIP_TYPES, FRAME_RATE, warShipProto,warShipProtoComments, TORPED_WIDTH,
TORPED_HEIGHT, X_MIN, X_MAX, Y_MAX , lvlChange, nSubChange} from './data/dataVariable.js';
// import { lvl, nSub } from './data/dataVariable.js';
import { techParam } from './data/dataSubmarine.js';
import { level } from './data/dataLevels.js';

// функция выполнения игры
export function game() {
  let lvl = lvlChange().current;
  load.style.visibility = 'visible';
  // кэш игровой страницы
  var gameCache = [level[lvl].seaSrc,
    level[lvl].skySrc,
    level[lvl].landSrc
  ];
  //корабли
  for (let i = 0; i < SHIP_TYPES; i++) {
    if (level[lvl].warShip[i] > 0) {
      gameCache[gameCache.length] = warShipProto[i].srcOnLeft;
      gameCache[gameCache.length] = warShipProto[i].srcOnRight;
      gameCache[gameCache.length] = warShipProto[i].destroySrc;
      gameCache[gameCache.length] = warShipProto[i].fireSrc;
      gameCache[gameCache.length] = warShipProto[i].destroyRevSrc;
    }
  }
  preload(gameCache, gameProcess);
}
function gameProcess() {
  const lvl = lvlChange().current;
  const nSub = nSubChange().current;
  var lvlGame = Object.create(level[lvl]);
  let pozitionPeriscope = 0,
    per_mouse_left = false, //используется в обработчике поворот перископа
    per_mouse_right = false, // используется в обработчике поворот перископа
    delayNewShip = 0, //счетчик задержки появления нового корабля
    offset1 = 0, //анимация моря
    offset2 = -50, //анимация моря
    direction_offset1 = "reduction", //анимация моря
    direction_offset2 = "increase"; //анимация моря
  // объекты "торпеды"
  var torpedComments = {
    x: "координата X (левый край торпеды)",
    y: "координата Y (верхний край торпеды)",
    width: "ширина торпеды",
    height: "длина торпеды",
    speed: "скорость торпеды",
    visible: "видимость торпеды (true/false)",
    rangeFactor: "коэффициент для расчета размера объекта в зависимости от его дальности от ПЛ (от 1 до 0.1)",
    accelerator: "изменение скорости торпеды в зависимости от применения модулей улучшения 1 - 100%"
  };
  var lTorped = {
    x: techParam[0].leftTorpedsX,
    y: 800,
    width: TORPED_WIDTH,
    height: TORPED_HEIGHT,
    speed: techParam[0].leftTorpedSpeed,
    visible: false,
    rangeFactor: 1,
    accelerator: 1
  };
  var cTorped = {
    x: techParam[nSub].centerTorpedsX,
    y: 800,
    width: TORPED_WIDTH,
    height: TORPED_HEIGHT,
    speed: techParam[nSub].centerTorpedSpeed,
    visible: false,
    rangeFactor: 1,
    accelerator: 1
  };
  var rTorped = {
    x: techParam[nSub].rightTorpedsX,
    y: 800,
    width: TORPED_WIDTH,
    height: TORPED_HEIGHT,
    speed: techParam[nSub].rightTorpedSpeed,
    visible: false,
    rangeFactor: 1,
    accelerator: 1
  };
  var torped = [torpedComments, lTorped, cTorped, rTorped];
  var shipsDestroy = 0; //уничтожено кораблей в этом уровне
  var shipsOnScreen = 0; //текущее количество кораблей на экране
  var sh = []; //массив кораблей, отображенных на экране
  sea1.src = lvlGame.seaSrc;
  sea2.src = lvlGame.seaSrc;
  sky.src = lvlGame.skySrc;
  land.src = lvlGame.landSrc;
  //визуализируем объекты игровой страницы
  visualGamePage();

  // поднимаем перископ
  lidMove(true);

  // игровой процесc
  let timerGame = setInterval(function() {
    delayNewShip++
    //делаем новый корабль если пауза до появления следующего корабля соблюдена,
    // кораблей на экране меньше,
    // чем задано по уровню и если выплыли ещё не все корабли
    if ((delayNewShip > lvlGame.delayNewShip - lvlGame.delayNewShipReduction *
       shipsDestroy) &&
       (shipsOnScreen < lvlGame.maxShips) && (lvlGame.namberOfShips != 0)) {
      let numberCreatingShip;
      //выбираем случайным образом тип корабля в зависимости от данных текущего уровня
      let changeShip = getRandomInRange(1, lvlGame.numberOfShips);
      //alert (changeShip);
      let changeTypeShip = "empty"; //выбранный случайным образом тип корабля
      //создаём корабль
      for (var i = 0; i < SHIP_TYPES; i++) {//alert ("i="+i + " кораблей этого типа"+ lvlGame.warShip[i])
        if ((lvlGame.warShip[i] >= changeShip) && (changeTypeShip == "empty")) {
          changeTypeShip = i;// alert ("создал "+ changeTypeShip);
        }
        changeShip = changeShip - lvlGame.warShip[i];
      }
      // отнимаем корабль выбранного типа из базы уровня
      lvlGame.warShip[changeTypeShip]--;
      // увеличиваем значение счётчика кораблей на экране
      shipsOnScreen++;
      // сбрасываем счётчик паузы до появления следующего корабля
      delayNewShip = 0;
      // счетчик оставшихся кораблей
      lvlGame.numberOfShips--;
      // ищем 'свободное место' для корабля от 1-го до lvlGame.maxShips
      for (let i = lvlGame.maxShips ; i > 0; i--) {
        if (typeof sh[i]  != 'object') {numberCreatingShip = i};
      }
      // alert (numberCreatingShip);
      // создаём корабль
      createShip(numberCreatingShip, changeTypeShip);

    }


    // Устанавливаем обработчик для событий клавиатуры
    document.onkeydown = selector;

    //обработчики событий мышки
    sonar.onclick = function() {
      pause()
    };
    indRightTorpedText.onclick = function() {
      startRightTorped()
    };
    indLeftTorpedText.onclick = function() {
      startLeftTorped()
    };
    indCenterTorpedText.onclick = function() {
      startCenterTorped()
    };
    buttonPerLeft.onmousedown = function() {
      per_mouse_left = true
    };
    buttonPerLeft.onmouseup = function() {
      per_mouse_left = false
    };
    buttonPerLeft.onmouseout = function() {
      per_mouse_left = false
    };
    buttonPerRight.onmousedown = function() {
      per_mouse_right = true
    };
    buttonPerRight.onmouseup = function() {
      per_mouse_right = false
    };
    buttonPerRight.onmouseout = function() {
      per_mouse_right = false
    };

    //анимация моря
    if ((offset1 >= -50) && (direction_offset1 == "reduction")) {
      offset1 = offset1 - 0.1
    };
    if ((offset1 <= 0) && (direction_offset1 == "increase")) {
      offset1 = offset1 + 0.1
    };
    if (offset1 >= 0) {
      direction_offset1 = "reduction"
    };
    if (offset1 <= -50) {
      direction_offset1 = "increase"
    };
    if ((offset2 >= -50) && (direction_offset2 == "reduction")) {
      offset2 = offset2 - 0.1
    };
    if ((offset2 <= 0) && (direction_offset2 == "increase")) {
      offset2 = offset2 + 0.1
    };
    if (offset2 >= 0) {
      direction_offset2 = "reduction"
    };
    if (offset2 <= -50) {
      direction_offset2 = "increase"
    };
    sea1.style.left = -techParam[nSub].maxRotateperiscope + offset1
      - pozitionPeriscope;
    sea2.style.left = -techParam[nSub].maxRotateperiscope + offset2
      - pozitionPeriscope;

    //цвет индикаторов торпед
    if (torped[1].y == 800) {
      indLeftTorpedText.style.background = "lightblue"
    }
    if (torped[2].y == 800) {
      indCenterTorpedText.style.background = "lightblue"
    }
    if (torped[3].y == 800) {
      indRightTorpedText.style.background = "lightblue"
    }

    // движение перископа по нажатию мыши
    if (per_mouse_left) {
      pozitionPeriscope = rotateperiscope("left", pozitionPeriscope);
    }
    if (per_mouse_right) {
      pozitionPeriscope = rotateperiscope("right", pozitionPeriscope);
    }
    // рассчет полета торпед
    for (let i = 1; i <= 3; i++) {
      if (torped[i].visible) {
        //коэффиц. который зависит от удаленности торпеды (от 1 до 0.25)
        torped[i].rangeFactor = 1 - (Y_MAX - torped[i].y) * 0.0025;
        // если торпеда рядом с горизонтом - увеличиваем её прозрачность
        if (torped[i].y < lvlGame.gorizontY - 80) {
          torped[i].opacity = 0.4} else {torped[i].opacity = 0.8;
        };
        //определяем размеры торпед в зависимости от удаленности
        torped[i].width = TORPED_WIDTH * torped[i].rangeFactor;
        torped[i].height = TORPED_HEIGHT * torped[i].rangeFactor;
        //если торпеда выпущена перемещаем её
        if (torped[i].y < Y_MAX) {
          torped[i].y = torped[i].y - torped[i].speed * torped[i].rangeFactor
        };
        //возвращаем торпеду в торпедный аппарат при y<450
        if (torped[i].y < 450 - torped[i].height) {
          torped[i].y = Y_MAX
        };
        //если торпеда ушла за горизонт делаем её невидимой
        if (torped[i].y < lvlGame.gorizontY - torped[i].height) {
          torped[i].visible = false
        }
        //если торпеда попала в цель делаем её невидимой
        //---------------------------прописать
      }
    }
    // рассчет движения кораблей
    // < кораблей максимального количества кораблей в уровне с проверкой пустых объектов
    for (let i = 1; i <= lvlGame.maxShips ; i++){
        //console.log (i+""+ typeof sh[i]);
      if (typeof sh[i] == 'object') {//alert (i);


        //расчет коэффициента размера кораблей
        sh[i].rangeFactor = 1 - (Y_MAX - sh[i].y) * 0.0025;
        //расчет коэффициента скорости кораблей в зависимости от дальности
        sh[i].speedFactor = 1 - (lvlGame.shipMaxY - sh[i].y) * 0.0025;
        //расчет размеров корабля для визуализации
        sh[i].currentWidth = sh[i].width * sh[i].rangeFactor;
        sh[i].currentHeight = sh[i].height * sh[i].rangeFactor;
        // скорость кораблей с учётом ускорения от подбитых целей
        if (sh[i].vectorLeft) {
          sh[i].x = sh[i].x + sh[i].speedX *
            (1+lvlGame.speedShipsMaxIncrease * shipsDestroy) * sh[i].speedFactor;
          } else {sh[i].x = sh[i].x - sh[i].speedX *
            (1+lvlGame.speedShipsMaxIncrease * shipsDestroy) * sh[i].speedFactor;
        }
        sh[i].y = sh[i].y + sh[i].speedY;
        //проверка уход за край дописать
        //if ((sh[i].x > 1100) || (sh[i].x < -400)) {sh[i].visible = false};
        if ((sh[i].y > level[lvl].shipMaxY) || (sh[i].y < level[lvl].shipMinY)) {
          if (sh[i].type == "zigzag") {sh[i].speedY = -sh[i].speedY}
          else {sh[i].speedY = 0;
          }
        }
      }
    }
    //      sh[i].x = sh[i].x  + sh[i].speedX;
    //      sh[i].y = sh[i].y  + sh[i].speedY;
    //      // расчет коэффициента размера кораблей
    //      sh[i].rangeFactor = 1 - (Y_MAX - sh[i].y) * 0.0025;
    //      sh[i].currentWidth = sh[i].width * sh[i].rangeFactor;
    //      sh[i].currentHeight = sh[i].height * sh[i].rangeFactor;
      //проверка уход за край
      //if ((ships[i].x > 1100) || (ships[i].x < -400)) {ships[i].visible = false};
      //if ((ships[i].y > level[lvl].shipMaxY) || (ships[i].y < level[lvl].shipMinY)) {
      //  if (ships[i].type == "zigzag") {ships[i].speedY = -ships[i].speedY}
      //  else {ships[i].speedY = 0;}
      //}
    //    }
    //визуализация левой торпеды
    if (torped[1].visible) {
      leftTorped.style.top = torped[1].y;
      leftTorped.style.left = torped[1].x - pozitionPeriscope + (TORPED_WIDTH - torped[1].width) / 2;
      leftTorped.style.width = torped[1].width;
      leftTorped.style.height = torped[1].height;
    }
    //визуализация центральной торпеды
    if (torped[2].visible) {
      centerTorped.style.top = torped[2].y;
      centerTorped.style.left = torped[2].x - pozitionPeriscope + (TORPED_WIDTH - torped[2].width) / 2;
      centerTorped.style.width = torped[2].width;
      centerTorped.style.height = torped[2].height;
    }
    //визуализация правой торпеды
    if (torped[3].visible) {
      rightTorped.style.top = torped[3].y;
      rightTorped.style.left = torped[3].x - pozitionPeriscope + (TORPED_WIDTH - torped[3].width) / 2;
      rightTorped.style.width = torped[3].width;
      rightTorped.style.height = torped[3].height;
    }
    // визуализация кораблей
    for (let n_ship = 1 ; n_ship <= lvlGame.maxShips; n_ship++){
      if (typeof sh[n_ship] == 'object') {shipElementVisual(n_ship)}
    }
  }, FRAME_RATE);
  //получение объекта событие, поворот перископа, запуск торпед,
  function selector(e) {
    e = e || window.event;
    // Получаем keyCode:
    var keyCode = e.keyCode;
    if (keyCode == 80) {
      pause()
    };
    //поворот перископа влево до значения -300
    if (keyCode == 37) {
        pozitionPeriscope = rotateperiscope("left", pozitionPeriscope)
    }
    //поворот перископа вправо до значения 300
    if (keyCode == 39) {
        pozitionPeriscope = rotateperiscope("right", pozitionPeriscope)
    }
    //запуск левой торпеды
    //запуск левой торпеды
    if (keyCode == 90) {
      startLeftTorped()
    }
    //запуск центральной торпеды
    if (keyCode == 88) {
      startCenterTorped()
    }
    //запуск правой торпеды
    if (keyCode == 67) {
      startRightTorped()
    }
    // Отменяем действие по умолчанию:
    e.preventDefault();
    e.returnValue = false;
    return false;
  }
  //создание объекта выплывающего корабля по прототипу корабля, создание элемента "корабль"
  function createShip(NShip, typeShip) {
    //создаём объект корабль
    sh[NShip] = Object.create(warShipProto[typeShip]);
    //выбираем направление движения корабля
    if (getRandomInRange(1, 100) <= lvlGame.directionShips) {
      sh[NShip].vectorLeft = true
    } else {
      sh[NShip].vectorLeft = false
    };
    //определяем координату Y
    sh[NShip].y = getRandomInRange(lvlGame.shipMinY, lvlGame.shipMaxY)
    //console.log ('sh[NShip].y = '+sh[NShip].y);
    //расчет коэффициента размера кораблей
    sh[NShip].rangeFactor = 1 - (Y_MAX - sh[NShip].y) * 0.0025;
    //расчет коэффициента скорости кораблей в зависимости от дальности
    sh[NShip].speedFactor = 1 - (lvlGame.shipMaxY - sh[NShip].y) * 0.0025;
    //расчет размеров корабля для визуализации
    sh[NShip].currentWidth = sh[NShip].width * sh[NShip].rangeFactor;
    sh[NShip].currentHeight = sh[NShip].height * sh[NShip].rangeFactor;
    //определяем координату X
    if (sh[NShip].vectorLeft) {
      sh[NShip].x = X_MIN - sh[NShip].currentWidth;
      sh[NShip].src = sh[NShip].srcOnLeft;

    } else {
      sh[NShip].x = X_MAX;
      sh[NShip].src = sh[NShip].srcOnRight;
    }
    // горизонтальная cкорость корабля (RND в пределах данных уровня умноженный
    // на коэфицент выбранного корабля и на коф дальности)
    sh[NShip].speedX = getRandomFloat(lvlGame.speedShipsMin, lvlGame.speedShipsMax);
    //sh[NShip].currentSpeedX = sh[NShip].speedX * sh[NShip].speedIndivid * sh[NShip].speedFactor;

    //  if (sh[NShip].vectorLeft == false) {
    //    sh[NShip].speedX = -sh[NShip].speedX
    //  }

    //вертикальная скорость корабля
    sh[NShip].speedY = getRandomFloat(0, lvlGame.speedShipsMaxY);
    if (rndTrue()) {
      sh[NShip].speedY = -sh[NShip].speedY
    };
    //определяем тип движения корабля
    if (sh[NShip].speedY == 0) {
      sh[NShip].typeMooving = "simple"
    };
    if (sh[NShip].speedY != 0) {
      if (rndTrue()) {
        sh[NShip].typeMooving = "zigzag";
      } else {
        sh[NShip].typeMooving = "diag";
      }
    }
    // задаём характеристики элементу
    //создаём элемент корабль
    let image = document.createElement("img");
    image.className = "ships";
    image.id = "ship" + NShip;
    gamePage.appendChild(image);
    }

    //информация о корабле (отладочный блок)
    //console.log("Осталось кораблей : " + lvlGame.numberOfShips + "\n " +
    //  "кораблей на экране"+ shipsOnScreen +
    //  warShipProtoComments.numberProto + " = " + sh[NShip].numberProto + "\n "+
    //  warShipProtoComments.name + " = " + sh[NShip].name + "\n " +
    //  warShipProtoComments.srcOnLeft + " = " + sh[NShip].srcOnLeft + "\n " +
    //  warShipProtoComments.srcOnRight + " = " + sh[NShip].srcOnRight + "\n " +
    //   + sh[NShip].src +
    //  warShipProtoComments.destroySrc + " = " + sh[NShip].destroySrc + "\n " +
    //  warShipProtoComments.destroyRevSrc + " = " + sh[NShip].destroyRevSrc + "\n " +
    //  warShipProtoComments.FireSrc + " = " + sh[NShip].FireSrc + "\n " +
    //  warShipProtoComments.health + " = " + sh[NShip].health + "\n " +
    //  warShipProtoComments.identity + " = " + sh[NShip].identity + "\n " +
    //  warShipProtoComments.typeMooving + " = " + sh[NShip].typeMooving + "\n " +
    //  warShipProtoComments.x + " = " + sh[NShip].x + "\n " +
    //  warShipProtoComments.y + " = " + sh[NShip].y + "\n " +
    //  warShipProtoComments.vectorLeft + " = " + sh[NShip].vectorLeft + "\n " +
    //  warShipProtoComments.rangeFactor + " = " + sh[NShip].rangeFactor + "\n " +
    //  warShipProtoComments.width + " = " + sh[NShip].width + "\n " +
    //  warShipProtoComments.currentWidth + " = " + sh[NShip].currentWidth + "\n " );
    //  warShipProtoComments.height + " = " + sh[NShip].height + "\n " +
    //  warShipProtoComments.currentHeight + " = " + sh[NShip].currentHeight + "\n " +
    //  warShipProtoComments.speedX + " = " + sh[NShip].speedX + "\n " +
    //  warShipProtoComments.speedY + " = " + sh[NShip].speedY + "\n " +
    //  warShipProtoComments.speedIndivid + " = " + sh[NShip].speedIndivid + " \n все данные. и так много. ");



  // визуализируем кораблики
  function shipElementVisual(n_ship) {
    //console.log (n_ship);
    let elementId = "ship" + n_ship;
    let ship_element = document.getElementById(elementId);
    //let x = Math.floor(sh[n_ship].x) - pozitionPeriscope;
    // let y = Math.floorsh[n_ship].y
    if (document.getElementById(elementId).src != sh[n_ship].src) {
      document.getElementById(elementId).src = sh[n_ship].src
    };
    //console.log ("tktvtyn"+ Math.floor(sh[n_ship].y));

    document.getElementById(elementId).style.top = sh[n_ship].y;
    document.getElementById(elementId).style.left = sh[n_ship].x - pozitionPeriscope;
    document.getElementById(elementId).style.zIndex = Math.floor(sh[n_ship].y);
    document.getElementById(elementId).style.width = sh[n_ship].currentWidth;
    document.getElementById(elementId).style.height = sh[n_ship].currentHeight;

  }
  //визуализируем объекты игровой страницы
  function visualGamePage() {
    gamePage.style.visibility = "visible";
    lid.style.zIndex = 819;
    lid2.style.zIndex = 819;
    sea1.style.zIndex = 2;
    sea1.style.opacity = 1;
    sea2.style.zIndex = 3;
    sea2.style.opacity = 0.5;
    periscope.style.zIndex = 820;
    crosshair.style.zIndex = 820;
    crosshair.style.opacity = 0.5;
    panel.style.zIndex = 820;
    sky.style.zIndex = 5;
    sky.style.left = -75 ;
    land.style.zIndex = 6;
    land.style.left = -300;
    indRotateperiscope.style.zIndex = 821;
    indLeftTorped.style.zIndex = 821;
    indCenterTorped.style.zIndex = 821;
    indRightTorped.style.zIndex = 821;
    indLeftTorpedText.style.zIndex = 821;
    indCenterTorpedText.style.zIndex = 821;
    indRightTorpedText.style.zIndex = 821;
    indRotatePerText.style.zIndex = 821;
    leftTorped.style.zIndex = 4;
    leftTorped.style.opacity = 0.8;
    centerTorped.style.zIndex = 4;
    centerTorped.style.opacity = 0.8;
    rightTorped.style.zIndex = 4;
    rightTorped.style.opacity = 0.8;
    buttonPerLeft.style.zIndex = 822;
    buttonPerRight.style.zIndex = 824;
    sonar.style.zIndex = 824;
    radio.style.zIndex = 824;
    pribor.style.zIndex = 824;
    indikatorDos.style.zIndex = 824;

    document.getElementById('indLeftTorpedText').innerText = techParam[nSub].leftTorpeds;
    document.getElementById('indCenterTorpedText').innerText = techParam[nSub].centerTorpeds;
    document.getElementById('indRightTorpedText').innerText = techParam[nSub].rightTorpeds;
  };
  //возвращает целое число из выбранного диапозоза
  function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //возвращает число с плавающей точкой из выбранного диапозоза
  function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  //возвращает true или false
  function rndTrue() {
    return (Math.floor(Math.random() * 2) === 0);
  }
  //открытие и закрытие перископа
  function lidMove(open) {
    let lid_y, lid2_y;
    if (open) {lid_y = 0, lid2_y = Y_MAX / 2} else {
      lid_y = - Y_MAX * 0.375, lid2_y = Y_MAX * 0.875;
    }
    let timer_lid = setInterval(function() {
      if (open) {
        if (lid_y > - Y_MAX * 0.375 ) {
          lid_y = lid_y - 2
          lid2_y = lid2_y + 2
        } else {
          clearTimeout(timer_lid)
        };
      } else {
        if (lid_y > 0) {
          lid_y = lid_y + 2
          lid2_y = lid2_y - 2
        } else {
          clearTimeout(timer_lid)
        };
      }
      lid.style.top = lid_y;
      lid2.style.top = lid2_y;
    }, 10);
  }
  //пауза в игре
  function pause() {
    alert("игра приостановлена. продолжить?");
    return false;
  }
  //функция поворота перископа
  function rotateperiscope(direction, pozitionPeriscope) {
    if (direction == "left") {
      if (pozitionPeriscope > -300) {
        pozitionPeriscope = pozitionPeriscope - 1 * techParam[nSub].speedRotateperiscope;
        if (pozitionPeriscope < -300) {
          pozitionPeriscope = -300
        }
      };
    };
    if (direction == "right") {
      if (pozitionPeriscope < 300) {
        pozitionPeriscope = pozitionPeriscope + 1 * techParam[nSub].speedRotateperiscope;
        if (pozitionPeriscope > 300) {
          pozitionPeriscope = 300
        }
      };
    };
    // выводим значение поворота перископа
    document.getElementById('indRotatePerText').innerText = "   " + conversionPozperiscope(pozitionPeriscope) + " °";
    //анимация неба
    sky.style.left = -100 - pozitionPeriscope / 3;
    //анимация суши
    land.style.left = -300 - pozitionPeriscope;
    return pozitionPeriscope;
  }
  //преобразует данные о повороте перископа (от -300 до 300) в градусы (300-60)
  function conversionPozperiscope(pozitionPeriscope) {
    var poz_periscope_degree;
    if (pozitionPeriscope >= 0) {
      poz_periscope_degree = pozitionPeriscope / 5
    };
    if (pozitionPeriscope < 0) {
      poz_periscope_degree = 360 + pozitionPeriscope / 5
    };
    return poz_periscope_degree;
  }
  //запуск торпед
  function startLeftTorped() {
    if ((torped[1].y == 800) && (techParam[nSub].leftTorpeds > 0)) {
      torped[1].y = 799;
      torped[1].x = techParam[nSub].leftTorpedsX + pozitionPeriscope;
      //списываем одну торпеду
      techParam[nSub].leftTorpeds--;
      //делаем торпеду видимой
      torped[1].visible = true;
      //вывожу на экран кол-во левых торпед
      document.getElementById('indLeftTorpedText').innerText = techParam[nSub].leftTorpeds;
      //меняю цвет индикатора запуска торпеды
      indLeftTorpedText.style.background = "red";
    }
    return false;
  }

  function startCenterTorped() {
    if ((torped[2].y == 800) && (techParam[nSub].centerTorpeds > 0)) {
      torped[2].y = 799;
      torped[2].x = techParam[nSub].centerTorpedsX + pozitionPeriscope;
      //списываем одну торпеду
      techParam[nSub].centerTorpeds--;
      //делаем торпеду видимой
      torped[2].visible = true;
      document.getElementById('indCenterTorpedText').innerText = techParam[nSub].centerTorpeds;
      //меняю цвет индикатора запуска торпеды
      indCenterTorpedText.style.background = "red";
    };
    return false;
  }

  function startRightTorped() {
    if ((torped[3].y == 800) && (techParam[nSub].rightTorpeds > 0)) {
      torped[3].y = 799;
      torped[3].x = techParam[nSub].rightTorpedsX + pozitionPeriscope;
      //списываем одну торпеду
      techParam[nSub].rightTorpeds--;
      //делаем торпеду видимой
      torped[3].visible = true;
      document.getElementById('indRightTorpedText').innerText = techParam[nSub].rightTorpeds;
      //меняю цвет индикатора запуска торпеды
      indRightTorpedText.style.background = "red";
      return false;
    }
  }
}




  /*
  /////////////////////////////////////////////////////////






      //проверка на попадания


      viuzalizationShips()
    },FRAME_RATE);




    }


    //визуализация кораблей
    function visualizationTorpeds() {
      //визуализация левой торпеды
      if (torped[0].visible) {
        //alert(torped[0].y);
        leftTorped.style.top    = torped[0].y;
        leftTorped.style.left   = torped[0].x - pozitionPeriscope +
          (TORPED_WIDTH - torped[0].width) / 2;
        leftTorped.style.width  = torped[0].width;
        leftTorped.style.height = torped[0].height;
      }


    }
    function viuzalizationShips(){

      sh0.style.left = ships[0].x - pozitionPeriscope;
      sh0.style.top = ships[0].y;
      sh0.style.width = ships[0].width;
      sh0.style.height = ships[0].height;
      sh0.style.zIndex = Math.floor(ships[0].y);
      sh0.src = ships[0].src;

      sh1.style.left = ships[1].x - pozitionPeriscope;
      sh1.style.top = ships[1].y;
      sh1.style.width = ships[1].width;
      sh1.style.height = ships[1].height;
      sh1.style.zIndex = Math.floor(ships[1].y);
      sh1.src = ships[1].src;

      sh2.style.left = ships[2].x - pozitionPeriscope;
      sh2.style.top = ships[2].y;
      sh2.style.width = ships[2].width;
      sh2.style.height = ships[2].height;
      sh2.style.zIndex = Math.floor(ships[2].y);
      sh2.src = ships[2].src;

      sh3.style.left = ships[3].x - pozitionPeriscope;
      sh3.style.top = ships[3].y;
      sh3.style.width = ships[3].width;
      sh3.style.height = ships[3].height;
      sh3.style.zIndex = Math.floor(ships[3].y);
      sh3.src = ships[3].src;

      sh4.style.left = ships[4].x - pozitionPeriscope;
      sh4.style.top = ships[4].y;
      sh4.style.width = ships[4].width;
      sh4.style.height = ships[4].height;
      sh4.style.zIndex = Math.floor(ships[4].y);
      sh4.src = ships[4].src;

      sh5.style.left = ships[5].x - pozitionPeriscope;
      sh5.style.top = ships[5].y;
      sh5.style.width = ships[5].width;
      sh5.style.height = ships[5].height;
      sh5.style.zIndex = Math.floor(ships[5].y);
      sh5.src = ships[5].src;
    }



  }
  */

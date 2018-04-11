import { preload } from './globalFunctions.js';
import { SHIP_TYPES, FRAME_RATE, warShipProto,warShipProtoComments, TORPED_WIDTH,
  TORPED_HEIGHT, X_MIN, X_MAX, Y_MAX , lvlChange, TORPEDO_START_Y,
  nSubChange} from './data/dataVariable.js';
import techParam from './data/dataSubmarine.js';
import level from './data/dataLevels.js';

// функция выполнения игры
export function game() {
  let lvl = lvlChange().current;
  load.style.visibility = 'visible';
  // кэш игровой страницы
  let gameCache = [level[lvl].seaSrc,
    level[lvl].skySrc,
    level[lvl].landSrc
  ];
  // добавляем в кэш изображения кораблей
  level[lvl].warShip.forEach( function(ships, index){
    let data_src = warShipProto[index];
    if (ships > 0) {
      gameCache.push(data_src.srcOnLeft);
      gameCache.push(data_src.srcOnLeft);
      gameCache.push(data_src.destroySrc);
      gameCache.push(data_src.fireSrc);
      gameCache.push(data_src.destroyRevSrc);
    }
  })
  //запуск функции кэширования изображений
  preload(gameCache, gameProcess);
}
function gameProcess() {
  const lvl = lvlChange().current;
  const nSub = nSubChange().current;
  let lvlGame = Object.create(level[lvl]);
  let subParam = techParam[nSub];
  let pozitionPeriscope = 0,
    per_mouse_left = false, // используется в обработчике поворот перископа
    per_mouse_right = false, // используется в обработчике поворот перископа
    delayNewShip = 0, // счетчик задержки появления нового корабля
    offset1 = 0, // анимация моря
    offset2 = -50, // анимация моря
    direction_offset1 = "reduction", // анимация моря
    direction_offset2 = "increase"; // анимация моря

  // объекты "торпеды"
  // x: "координата X (левый край торпеды)",
  // y: "координата Y (верхний край торпеды)",
  // width: "ширина торпеды",
  //  height: "длина торпеды",
  //  speed: "скорость торпеды",
  //  visible: "видимость торпеды (true/false)",
  //  rangeFactor: "коэффициент для расчета размера объекта в зависимости от его дальности от ПЛ (от 1 до 0.1)",
  //  accelerator: "изменение скорости торпеды в зависимости от применения модулей улучшения 1 - 100%"

  let torped = subParam.tubes.map(tube => ({
    x: tube.x,
    y: TORPEDO_START_Y,
    width: TORPED_WIDTH,
    height: TORPED_HEIGHT,
    speed: tube.speed,
    visible: false,
    rangeFactor: 1,
    accelerator: 1,
  }))
  let shipsDestroy = 0; // уничтожено кораблей в этом уровне
  let shipsOnScreen = 0; // текущее количество кораблей на экране
  let sh = []; // массив кораблей, отображенных на экране
  sea1.src = lvlGame.seaSrc;
  sea2.src = lvlGame.seaSrc;
  sky.src = lvlGame.skySrc;
  land.src = lvlGame.landSrc;
  // визуализируем объекты игровой страницы
  visualGamePage();

  //  поднимаем перископ
  lidMove(true);

  // игровой процесc
  let timerGame = setInterval(function() {
    delayNewShip++
    // делаем новый корабль если пауза до появления следующего корабля соблюдена,
    // кораблей на экране меньше,
    // чем задано по уровню и если выплыли ещё не все корабли
    if ((delayNewShip > lvlGame.delayNewShip - lvlGame.delayNewShipReduction *
       shipsDestroy) &&
       (shipsOnScreen < lvlGame.maxShips) && (lvlGame.numberOfShips > 0)) {
      let numberCreatingShip;
      // выбираем RND способом тип корабля в зависимости от данных тек. уровня
      let changeShip = getRandomInRange(1, lvlGame.numberOfShips);
      let changeTypeShip = "empty"; // выбранный случайным образом тип корабля
      // создаём корабль
      // выбираем тип корабля из оставшихся в данном уровне
      lvlGame.warShip.forEach( function(ships, ship_type){
        if ((ships >= changeShip) && (changeTypeShip == "empty")){
          changeTypeShip = ship_type;
        }
        changeShip = changeShip - ships;
      });
      // ищем 'свободное место' для корабля от 1-го до lvlGame.maxShips
      for (let i = lvlGame.maxShips-1 ; i >= 0; i--) {
        if (typeof sh[i]  != 'object') {numberCreatingShip = i};
      }
      // создаём корабль
      createShip(numberCreatingShip, changeTypeShip);
      console.log('созданный корабль' + sh[numberCreatingShip]);
    }

    // Устанавливаем обработчик для событий клавиатуры
    document.onkeydown = selector;
    // обработчики событий мышки
    sonar.onclick = function() {
      pause()
    };
    indRightTorpedText.onclick = function() {
      startTorpedo(2)
    };
    indLeftTorpedText.onclick = function() {
      startTorpedo(0)
    };
    indCenterTorpedText.onclick = function() {
      startTorpedo(1)
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

    // анимация моря
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
    sea1.style.left = -subParam.maxRotateperiscope + offset1
      - pozitionPeriscope;
    sea2.style.left = -subParam.maxRotateperiscope + offset2
      - pozitionPeriscope;

    // цвет индикаторов торпед
    if (torped[0].y == TORPEDO_START_Y) {
      indLeftTorpedText.style.background = "lightblue"
    }
    if (torped[1].y == TORPEDO_START_Y) {
      indCenterTorpedText.style.background = "lightblue"
    }
    if (torped[2].y == TORPEDO_START_Y) {
      indRightTorpedText.style.background = "lightblue"
    }

    // движение перископа по нажатию мыши
    if (per_mouse_left) {
      pozitionPeriscope = rotateperiscope("left", pozitionPeriscope);
    }
    if (per_mouse_right) {
      pozitionPeriscope = rotateperiscope("right", pozitionPeriscope);
    }
    // рассчет полета торпед, визуализация торпед
    torped.forEach(function(torpedo) {
      if (torpedo.visible) {
        // коэффиц. который зависит от удаленности торпеды (от 1 до 0.25)
        torpedo.rangeFactor = 1 - (TORPEDO_START_Y - torpedo.y) * 0.0025;
        // если торпеда рядом с горизонтом - увеличиваем её прозрачность
        if (torpedo.y < lvlGame.gorizontY - 80) {
          torpedo.opacity = 0.4} else {torpedo.opacity = 0.8;
        };
        // определяем размеры торпед в зависимости от удаленности
        torpedo.width = TORPED_WIDTH * torpedo.rangeFactor;
        torpedo.height = TORPED_HEIGHT * torpedo.rangeFactor;
        // если торпеда выпущена перемещаем её
        if (torpedo.y < TORPEDO_START_Y) {
          torpedo.y = torpedo.y - torpedo.speed * torpedo.rangeFactor
        };
        // возвращаем торпеду в торпедный аппарат при y<450
        if (torpedo.y < 450 - torpedo.height) {
          torpedo.y = TORPEDO_START_Y
        };
        // если торпеда ушла за горизонт делаем её невидимой
        if (torpedo.y < lvlGame.gorizontY - torpedo.height) {
          torpedo.visible = false
        }
        // если торпеда попала в цель делаем её невидимой
        // ---------------------------прописать
        // вызов функции визуализации торпед
        if (torpedo.visible) {torpedsElementVisual()};
      }
    })
    // рассчет движения кораблей, визуализация кораблей
    sh.forEach( function(ship, n_ship_on_screen){
      if (typeof ship == 'object') {
        // расчет коэффициента размера кораблей
        ship.rangeFactor = 1 - (Y_MAX - ship.y) * 0.0025;
        // расчет коэффициента скорости кораблей в зависимости от дальности
        ship.speedFactor = 1 - (lvlGame.shipMaxY - ship.y) * 0.0025;
        // расчет размеров корабля для визуализации
        ship.currentWidth = ship.width * ship.rangeFactor;
        ship.currentHeight = ship.height * ship.rangeFactor;
        // скорость кораблей с учётом ускорения от подбитых целей
        if (ship.vectorLeft) {
          ship.x = ship.x + ship.speedX *
            (1+lvlGame.speedShipsMaxIncrease * shipsDestroy) * ship.speedFactor;
          } else {ship.x = ship.x - ship.speedX *
            (1+lvlGame.speedShipsMaxIncrease * shipsDestroy) * ship.speedFactor;
        }
        ship.y = ship.y + ship.speedY;
        // поведение корабля
        if ((ship.y > lvlGame.shipMaxY) || (ship.y < lvlGame.shipMinY)) {
          if (ship.typeMooving == "zigzag") {ship.speedY = -ship.speedY}
          // else {ship.speedY = 0;
          // }
        }
        // вызов функции визуализации кораблей
        shipElementVisual(n_ship_on_screen)
        // проверка уход за край, удаление объекта если он вне видимости ПЛ,
        if ((ship.x > X_MAX) || (ship.x < X_MIN - ship.currentWidth)) {
          deleteObj(n_ship_on_screen);
        }
      }
    });
  }, FRAME_RATE);

  // удаление объекта и элемента img
  function deleteObj(index) {console.log (sh[index]);
    let deleting_element = document.getElementById('ship'+index);
    gamePage.removeChild(deleting_element);
    // уменьшаем  счётчик кораблей на экране
    shipsOnScreen--;
    delete sh[index];
  }
  // получение объекта событие, поворот перископа, запуск торпед.
  function selector(e) {
    e = e || window.event;
    // Получаем keyCode:
    let keyCode = e.keyCode;
    if (keyCode == 80) {
      pause()
    };
    // поворот перископа влево до значения -300
    if (keyCode == 37) {
        pozitionPeriscope = rotateperiscope("left", pozitionPeriscope)
    }
    // поворот перископа вправо до значения 300
    if (keyCode == 39) {
        pozitionPeriscope = rotateperiscope("right", pozitionPeriscope)
    }
    // запуск левой торпеды
    if (keyCode == 90) {
      startTorpedo(0);
    }
    // запуск центральной торпеды
    if (keyCode == 88) {
      startTorpedo(1)
    }
    // запуск правой торпеды
    if (keyCode == 67) {
      startTorpedo(2)
    }
    // Отменяем действие по умолчанию:
    e.preventDefault();
    e.returnValue = false;
    return false;
  }
  // создание объекта и элемента выплывающего корабля по прототипу корабля
  function createShip(NShip, typeShip) {
    // индикатор (true - найдена подходящая координата 'y' для нового корабля)
    let y_ok = false;
    // создаём объект корабль
    sh[NShip] = Object.create(warShipProto[typeShip]);
    // выбираем направление движения корабля
    if (getRandomInRange(1, 100) <= lvlGame.directionShips) {
      sh[NShip].vectorLeft = true
    } else {
      sh[NShip].vectorLeft = false
    };
    // определяем координату Y я просто как раз это и писал.. недописал
    while (y_ok != true) {
      let random_y = getRandomInRange(lvlGame.shipMinY, lvlGame.shipMaxY);
      let ships_on_line = shipsOnLine(random_y);
      if (ships_on_line.length == 0) {y_ok = true} else {y_ok = false};

      //--------------------------------------------------------------------------------------------
      sh[NShip].y = random_y;
    }

    // console.log ('sh[NShip].y = '+sh[NShip].y);
    // расчет коэффициента размера кораблей
    sh[NShip].rangeFactor = 1 - (Y_MAX - sh[NShip].y) * 0.0025;
    // расчет коэффициента скорости кораблей в зависимости от дальности
    sh[NShip].speedFactor = 1 - (lvlGame.shipMaxY - sh[NShip].y) * 0.0025;
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
    sh[NShip].speedX = getRandomFloat(lvlGame.speedShipsMin, lvlGame.speedShipsMax);
    // вертикальная скорость корабля
    sh[NShip].speedY = getRandomFloat(0, lvlGame.speedShipsMaxY);
    if (rndTrue()) {
      sh[NShip].speedY = -sh[NShip].speedY
    };
    // определяем тип движения корабля
    if (sh[NShip].speedY == 0) {
      sh[NShip].typeMooving = "simple"
    };
    // пока оставил только zigzag
    if (sh[NShip].speedY != 0) {
      sh[NShip].typeMooving = "zigzag";
    //  if (rndTrue()) {
    //    sh[NShip].typeMooving = "zigzag";
    //  } else {
      //  sh[NShip].typeMooving = "diag";
      // }
    }
    // отнимаем корабль выбранного типа из базы уровня
    lvlGame.warShip[typeShip]--;
    // увеличиваем значение счётчика кораблей на экране
    shipsOnScreen++;
    // сбрасываем счётчик паузы до появления следующего корабля
    delayNewShip = 0;
    // счетчик оставшихся кораблей
    lvlGame.numberOfShips--;
    // задаём характеристики элементу
    // создаём элемент корабль
    let image = document.createElement("img");
    image.className = "ships";
    image.id = "ship" + NShip;
    gamePage.appendChild(image);
  }

  // визуализируем торпеды
  function torpedsElementVisual() {
    let torpedsImg = [leftTorped, centerTorped, rightTorped];
    torpedsImg.forEach( function(torpedo_img, n_torped_obj) {
      if (torped[n_torped_obj].visible) {
        torpedo_img.style.top =  torped[n_torped_obj].y;
        torpedo_img.style.left = torped[n_torped_obj].x - pozitionPeriscope +
          (TORPED_WIDTH - torped[n_torped_obj].width) / 2;
        torpedo_img.style.width =  torped[n_torped_obj].width;
        torpedo_img.style.height =  torped[n_torped_obj].height;
      }
    });
  }
  // визуализируем кораблики
  function shipElementVisual(n_ship) {
    // console.log (n_ship);
    let elementId = "ship" + n_ship;
    let ship_element = document.getElementById(elementId);
    if (ship_element.src != sh[n_ship].src) {
      ship_element.src = sh[n_ship].src
    };
    ship_element.style.top = sh[n_ship].y;
    ship_element.style.left = sh[n_ship].x - pozitionPeriscope;
    ship_element.style.zIndex = Math.floor(sh[n_ship].y);
    ship_element.style.width = sh[n_ship].currentWidth;
    ship_element.style.height = sh[n_ship].currentHeight;

  }
  // визуализируем объекты игровой страницы
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

    document.getElementById('indLeftTorpedText').innerText = subParam.tubes[0].torpeds;
    document.getElementById('indCenterTorpedText').innerText = subParam.tubes[1].torpeds;
    document.getElementById('indRightTorpedText').innerText = subParam.tubes[2].torpeds;
  };
  // возвращает целое число из выбранного диапозоза
  function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // возвращает число с плавающей точкой из выбранного диапозоза
  function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  // возвращает true или false
  function rndTrue() {
    return (Math.floor(Math.random() * 2) === 0);
  }
  // открытие и закрытие перископа
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
  // пауза в игре
  function pause() {
    alert("игра приостановлена. продолжить?");
    return false;
  }
  // функция поворота перископа
  function rotateperiscope(direction, pozitionPeriscope) {
    if (direction == "left") {
      if (pozitionPeriscope > -300) {
        pozitionPeriscope = pozitionPeriscope - 1 * subParam.speedRotateperiscope;
        if (pozitionPeriscope < -300) {
          pozitionPeriscope = -300
        }
      };
    };
    if (direction == "right") {
      if (pozitionPeriscope < 300) {
        pozitionPeriscope = pozitionPeriscope + 1 * subParam.speedRotateperiscope;
        if (pozitionPeriscope > 300) {
          pozitionPeriscope = 300
        }
      };
    };
    // выводим значение поворота перископа
    document.getElementById('indRotatePerText').innerText = "   " + conversionPozperiscope(pozitionPeriscope) + " °";
    // анимация неба
    sky.style.left = -100 - pozitionPeriscope / 3;
    // анимация суши
    land.style.left = -300 - pozitionPeriscope;
    return pozitionPeriscope;
  }
  // преобразует данные о повороте перископа (от -300 до 300) в градусы (300-60)
  function conversionPozperiscope(pozitionPeriscope) {
    let poz_periscope_degree;
    if (pozitionPeriscope >= 0) {
      poz_periscope_degree = pozitionPeriscope / 5
    };
    if (pozitionPeriscope < 0) {
      poz_periscope_degree = 360 + pozitionPeriscope / 5
    };
    return poz_periscope_degree;
  }
  // запуск торпед
  function startTorpedo(n_tube){
    let tube = subParam.tubes[n_tube];
    let torpedo = torped[n_tube];
    const indTubeId =
      ['indLeftTorpedText', 'indCenterTorpedText', 'indRightTorpedText'][n_tube];
    const indTube = document.getElementById(indTubeId);
    if ((torpedo.y == TORPEDO_START_Y) && (tube.torpeds > 0)) {
      torpedo.y = TORPEDO_START_Y - 1;
      torpedo.x = tube.x + pozitionPeriscope;
      // списываем одну торпеду
      tube.torpeds--;
      // делаем торпеду видимой
      torpedo.visible = true;
      // вывожу на экран кол-во торпед
      indTube.innerText = tube.torpeds;
      // меняю цвет индикатора запуска торпеды
      indTube.style.background = "red";
    }
    console.log(torpedo);
  }
  // функция определения существующих кораблей с данной координатой y
  function shipsOnLine (validation_y) {
    let ships_on_line = [];
    sh.forEach( function(ship, n_ship_on_screen) {
      if (Math.floor(ship.y) == Math.floor(validation_y)) {
        ships_on_line.push(n_ship_on_screen);
      }
    });
    return ships_on_line;
  }
}

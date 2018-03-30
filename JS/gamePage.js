
//функция выполнения игры
function game(){
  load.style.visibility = "visible";
  // кэш игровой страницы
  var gameCache = [level[lvl].seaSrc,
                   level[lvl].skySrc,
                   level[lvl].landSrc];
  //корабли
  for (var i = 1; i <= SHIP_TYPES; i++){
    if (level[lvl].warShip[i] > 0) {
      gameCache[gameCache.length] = warShipProto[i].src;
      gameCache[gameCache.length] = warShipProto[i].reversSrc;
      gameCache[gameCache.length] = warShipProto[i].destroySrc;
      gameCache[gameCache.length] = warShipProto[i].fireSrc;
      gameCache[gameCache.length] = warShipProto[i].destroyRevSrc;
    }
  }
  preload(gameCache,gameProcess);
}
// использует глобальные переменные lvl и nSub
function gameProcess() {
  //загружаем море, небо, землю
  sea1.src = level[lvl].seaSrc;
  sea2.src = level[lvl].seaSrc;
  sky.src  = level[lvl].skySrc;
  land.src = level[lvl].landSrc;



  var pozitionPeriscop  = 0,
      per_mouse_left    = false,        //используется в обработчике поворот перископа
      per_mouse_right   = false,        //используется в обработчике поворот перископа
      delayNewShip      = 0,            //счетчик задержки появления нового корабля
      offset1           = 0,            //анимация моря
      offset2           = -50,          //анимация моря
      direction_offset1 = "reduction",  //анимация моря
      direction_offset2 = "increase";   //анимация моря
  // объекты "торпеды"
  var torpedComments = {
      x :      "координата X (левый край торпеды)",
      y :      "координата Y (верхний край торпеды)",
      width :  "ширина торпеды",
      height:  "длина торпеды",
      speed:   "скорость торпеды",
      visible: "видимость торпеды (true/false)",
      kof:     "изменение скорости торпеды в зависимости от применения модулей улучшения"
  };
  var lTorped = {
    x : techParam[nSub].leftTorpedsX,
    y : 800,
    width : TORPED_WIDTH,
    height: TORPED_HEIGHT,
    speed: techParam[nSub].leftTorpedSpeed,
    visible: false,
    kof: 1
    };
  var cTorped = {
    x : techParam[nSub].centerTorpedsX,
    y : 800,
    width : TORPED_WIDTH,
    height: TORPED_HEIGHT,
    speed: techParam[nSub].centerTorpedSpeed,
    visible: false,
    kof: 1
  };
  var rTorped = {
    x : techParam[nSub].rightTorpedsX,
    y : 800,
    width : TORPED_WIDTH,
    height: TORPED_HEIGHT,
    speed: techParam[nSub].rightTorpedSpeed,
    visible: false,
    kof: 1
  };
  var torped = [torpedComments,lTorped, cTorped, rTorped];
  var shipsDestroy  = 0; //уничтожено кораблей
  var shipsOnScreen = 0; //текущее количество кораблей на экране
  //визуализируем объекты игровой страницы
  visualGamePage();

  //поднимаем перископ
  lidMove(true);

  //игровой процес
  var timerGame = setInterval(function(){
    delayNewShip++

    //делаем новый корабль
    if ((delayNewShip > level[lvl].delayNewShip - level[lvl].delayNewShipReduction * shipsDestroy)&&
        (shipsOnScreen < level[lvl].maxShips)){
      shipsOnScreen++;
      delayNewShip = 0;

      //---------создаем корабль
    }
    // Устанавливаем обработчик для событий клавиатуры
    document.onkeydown = selector;
    //обработчики событий мышки
    (function (){
      sonar.onclick               = function(){pause()};
      indRightTorpedText.onclick  = function(){startRightTorped ()};
      indLeftTorpedText.onclick   = function(){startLeftTorped ()};
      indCenterTorpedText.onclick = function(){startCenterTorped ()};
      buttonPerLeft.onmousedown   = function(){per_mouse_left  = true};
      buttonPerLeft.onmouseup     = function(){per_mouse_left  = false};
      buttonPerLeft.onmouseout    = function(){per_mouse_left  = false};
      buttonPerRight.onmousedown  = function(){per_mouse_right = true};
      buttonPerRight.onmouseup    = function(){per_mouse_right = false};
      buttonPerRight.onmouseout   = function(){per_mouse_right = false};
    })();
    //анимация моря
    (function (){
      if ((offset1 >= -50) && (direction_offset1 == "reduction")) {offset1 = offset1 - 0.1};
      if ((offset1 <= 0)   && (direction_offset1 == "increase"))  {offset1 = offset1 + 0.1};
      if (offset1  >= 0)   {direction_offset1 = "reduction"};
      if (offset1  <= -50) {direction_offset1 = "increase"};
      if ((offset2 >= -50) && (direction_offset2 == "reduction")) {offset2 = offset2 - 0.05};
      if ((offset2 <= 0)   && (direction_offset2 == "increase"))  {offset2 = offset2 + 0.05};
      if (offset2  >= 0)   {direction_offset2 = "reduction"};
      if (offset2  <= -50) {direction_offset2 = "increase"};
      sea1.style.left = -techParam[nSub].maxRotatePeriscop + offset1/2 - pozitionPeriscop;
      sea2.style.left = -techParam[nSub].maxRotatePeriscop + offset2/2 - pozitionPeriscop;
    })();
    //цвет индикаторов торпед
    if (torped[1].y == 800) {indLeftTorpedText.style.background   = "lightblue"}
    if (torped[2].y == 800) {indCenterTorpedText.style.background = "lightblue"}
    if (torped[3].y == 800) {indRightTorpedText.style.background  = "lightblue"}
    // движение перископа по нажатию мыши
    if (per_mouse_left)  {rotatePeriscop ("left")}
    if (per_mouse_right) {rotatePeriscop ("right")}
    //рассчет полета торпед
    for (var i = 1; i <= 3; i++) {
      if (torped[i].visible) {
        //коэффиц. который зависит от удаленности торпеды (от 1 до 0.25)
        torped[i].kof = 1-(800-torped[i].y)*0.0015;
        //определяем размеры торпед в зависимости от удаленности
        torped[i].width  = TORPED_WIDTH  * torped[i].kof;
        torped[i].height = TORPED_HEIGHT * torped[i].kof;
        //если торпеда выпущена перемещаем её
        if (torped[i].y < 800) {torped[i].y = torped[i].y - torped[i].speed * torped[i].kof};
        //возвращаем торпеду в торпедный аппарат при y<300
        if (torped[i].y < 300) {torped[i].y = 800};
        //если торпеда ушла за горизонт делаем её невидимой
        if (torped[i].y < level[lvl].gorizontY) {torped[i].visible = false}
        //если торпеда попала в цель делаем её невидимой
        //---------------------------прописать
      }
    }
    //визуализация левой торпеды

    if (torped[1].visible) {
      leftTorped.style.top    = torped[1].y;
      leftTorped.style.left   = torped[1].x - pozitionPeriscop + (TORPED_WIDTH - torped[1].width) / 2;
      leftTorped.style.width  = torped[1].width;
      leftTorped.style.height = torped[1].height;
    }
    //визуализация центральной торпеды
    if (torped[2].visible) {
      centerTorped.style.top    = torped[2].y;
      centerTorped.style.left   = torped[2].x - pozitionPeriscop + (TORPED_WIDTH - torped[2].width) / 2;
      centerTorped.style.width  = torped[2].width;
      centerTorped.style.height = torped[2].height;
    }
    //визуализация правой торпеды
    if (torped[3].visible) {
      //alert(torped[0].y);
      rightTorped.style.top    = torped[3].y;
      rightTorped.style.left   = torped[3].x - pozitionPeriscop + (TORPED_WIDTH - torped[3].width) / 2;
      rightTorped.style.width  = torped[3].width;
      rightTorped.style.height = torped[3].height;
    }


    },FRAME_RATE);


  //получение объекта событие, поворот перископа, запуск торпед,
  function selector(e){
    e = e || window.event;
    // Получаем keyCode:
    var keyCode = e.keyCode;
    if (keyCode == 80) {pause()};
    //поворот перископа влево до значения -300
    if (keyCode == 37) {rotatePeriscop ("left")}
    //поворот перископа вправо до значения 300
    if (keyCode == 39) {rotatePeriscop ("right")}
    //запуск левой торпеды
    //запуск левой торпеды
    if (keyCode == 90) {startLeftTorped()}
    //запуск центральной торпеды
    if (keyCode == 88) {startCenterTorped()}
    //запуск правой торпеды
    if (keyCode == 67) {startRightTorped()}


    // Отменяем действие по умолчанию:
    e.preventDefault();
    e.returnValue = false;
    return false;
  }

  //визуализируем объекты игровой страницы
  function visualGamePage(){
    gamePage.style.visibility      = "visible";
    lid.style.zIndex               = 819;
    sea1.style.zIndex              = 2;   sea1.style.opacity              = 1;
    sea2.style.zIndex              = 3;   sea2.style.opacity              = 0.5;
    periscop.style.zIndex          = 820;
    crosshair.style.zIndex         = 820;  crosshair.style.opacity        = 0.5;
    panel.style.zIndex             = 820;
    sky.style.zIndex               = 3;
    sky.style.left                 = -75 - pozitionPeriscop/6;
    land.style.zIndex              = 5;
    land.style.left                = -300 - pozitionPeriscop;
    indRotatePeriscop.style.zIndex = 821;
    indLeftTorped.style.zIndex     = 821;
    indCenterTorped.style.zIndex   = 821;
    indRightTorped.style.zIndex    = 821;
    indLeftTorpedText.style.zIndex = 821;
    indCenterTorpedText.style.zIndex=821;
    indRightTorpedText.style.zIndex= 821;
    indRotatePerText.style.zIndex  = 821;
    leftTorped.style.zIndex        = 4;   leftTorped.style.opacity        = 0.6;
    centerTorped.style.zIndex      = 4;   centerTorped.style.opacity      = 0.6;
    rightTorped.style.zIndex       = 4;   rightTorped.style.opacity       = 0.6;
    buttonPerLeft.style.zIndex     = 822;
    buttonPerRight.style.zIndex    = 824;
    sonar.style.zIndex             = 824;
    radio.style.zIndex             = 824;
    pribor.style.zIndex            = 824;
    indikatorDos.style.zIndex      = 824;

    document.getElementById('indLeftTorpedText').innerText   = techParam[nSub].leftTorpeds;
    document.getElementById('indCenterTorpedText').innerText = techParam[nSub].centerTorpeds;
    document.getElementById('indRightTorpedText').innerText  = techParam[nSub].rightTorpeds;
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
  function lidMove (open) {
    var lid_y = lid.style.top;
    var timer_lid = setInterval(function(){
      if(open) {
        if (lid_y >-700)  {lid_y = lid_y - 10} else {clearTimeout(timer_lid)};
      }
      else {
        if (lid_y <-10)  {lid_y = lid_y + 10} else {clearTimeout(timer_lid)};
      }
      lid.style.top = lid_y;
    },FRAME_RATE);
  }
  //пауза в игре
  function pause (){
     alert("игра приостановлена. продолжить?");
     return false;
  }
  //функция поворота перископа
  function rotatePeriscop (direction){
    if (direction == "left") {
      if (pozitionPeriscop > -300){
        pozitionPeriscop = pozitionPeriscop - 1 *  techParam[nSub].speedRotatePeriscop;
        if (pozitionPeriscop<-300) {pozitionPeriscop = -300}
      };
    };
    if (direction == "right") {
      if (pozitionPeriscop < 300){
        pozitionPeriscop = pozitionPeriscop + 1 *  techParam[nSub].speedRotatePeriscop;
        if (pozitionPeriscop>300) {pozitionPeriscop = 300}
      };
    };
    // выводим значение поворота перископа
    document.getElementById('indRotatePerText').innerText
      = "   " + conversionPozPeriscop(pozitionPeriscop) + " °";
      //анимация неба
      sky.style.left = -75 - pozitionPeriscop/6;
      //анимация суши
      land.style.left = -300 - pozitionPeriscop;
    return false;
  }
  //преобразует данные о повороте перископа (от -300 до 300) в градусы (300-60)
  function conversionPozPeriscop(pozitionPeriscop){
    var poz_periscop_degree;
    if (pozitionPeriscop >= 0) {poz_periscop_degree = pozitionPeriscop / 5};
    if (pozitionPeriscop < 0) {poz_periscop_degree = 360 + pozitionPeriscop / 5};
    return poz_periscop_degree;
  }
  //запуск торпед
  function startLeftTorped () {
    if ((torped[1].y == 800) && (techParam[nSub].leftTorpeds > 0)) {
      torped[1].y = 799;
      torped[1].x = techParam[nSub].leftTorpedsX + pozitionPeriscop;
      //списываем одну торпеду
      techParam[nSub].leftTorpeds--;
      //делаем торпеду видимой
      torped[1].visible = true;
      //вывожу на экран кол-во левых торпед
      document.getElementById('indLeftTorpedText').innerText
        = techParam[nSub].leftTorpeds;
      //меняю цвет индикатора запуска торпеды
      indLeftTorpedText.style.background = "red";
    }
    return false;
  }
  function startCenterTorped () {
    if ((torped[2].y == 800) && (techParam[nSub].centerTorpeds > 0)) {
      torped[2].y = 799;
      torped[2].x = techParam[nSub].centerTorpedsX + pozitionPeriscop;
      //списываем одну торпеду
      techParam[nSub].centerTorpeds--;
      //делаем торпеду видимой
      torped[2].visible = true;
      document.getElementById('indCenterTorpedText').innerText
        = techParam[nSub].centerTorpeds;
      //меняю цвет индикатора запуска торпеды
      indCenterTorpedText.style.background = "red";
    };
    return false;
  }
  function startRightTorped () {
    if ((torped[3].y == 800) && (techParam[nSub].rightTorpeds > 0)) {
      torped[3].y = 799;
      torped[3].x = techParam[nSub].rightTorpedsX + pozitionPeriscop;
      //списываем одну торпеду
      techParam[nSub].rightTorpeds--;
      //делаем торпеду видимой
      torped[3].visible = true;
      document.getElementById('indRightTorpedText').innerText
        = techParam[nSub].rightTorpeds;
      //меняю цвет индикатора запуска торпеды
      indRightTorpedText.style.background = "red";
      return false;
    }
  }
}




/*
/////////////////////////////////////////////////////////




    //создание кораблей
    for (var i = 0; i<level[lvl].maxShips ;i++){
      if ((ships[i].visible == false) && (delayNewShip>level[lvl].delayNewShip)) {
        ships[i].visible = true;
        delayNewShip = 0; //сбрасываю сетчик при создании нового корабля
        //направление движения корабля
        ships[i].vectorLeft = rndTrue();
        if (ships[i].vectorLeft) {
          ships[i].x = -400; ships[i].src = "images/ship_1/ship.png"} else
            {ships[i].x = 1100; ships[i].src = "images/ship_1/ship2.png"}

        ships[i].y = getRandomInRange (level[lvl].shipMinY ,level[lvl].shipMaxY)
        //горизонтальная cкорость корабля
        ships[i].speedX = getRandomFloat(level[lvl].speedShipsMin , level[lvl].speedShipsMax);
        if (ships[i].vectorLeft == false) {ships[i].speedX = - ships[i].speedX}

        //вертикальная скорость корабля
        ships[i].speedY = getRandomFloat(0 ,level[lvl].speedShipsMaxY);
        if (rndTrue()) {ships[i].speedY = -ships[i].speedY};

        if (ships[i].speedY == 0) {ships[i].type = "simple"};
        if (ships[i].speedY != 0) {
          if(rndTrue()) {ships[i].type = "zigzag"} else {ships[i].type = "diag"}

        }
      }
    }
    //движение кораблей
    for (var i = 0; i < level[lvl].maxShips ;i++){
      ships[i].x = ships[i].x  + ships[i].speedX;
      ships[i].y = ships[i].y  + ships[i].speedY;
      ships[i].kof = 1-(800-ships[i].y)*0.0015;
      ships[i].width = SHIP_WIDTH * ships[i].kof;
      ships[i].height = SHIP_HEIGHT * ships[i].kof;
      //проверка уход за край
      if ((ships[i].x > 1100) || (ships[i].x < -400)) {ships[i].visible = false};
      if ((ships[i].y > level[lvl].shipMaxY) || (ships[i].y < level[lvl].shipMinY)) {
        if (ships[i].type == "zigzag") {ships[i].speedY = -ships[i].speedY}
        else {ships[i].speedY = 0;}
      }
    }

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
      leftTorped.style.left   = torped[0].x - pozitionPeriscop +
        (TORPED_WIDTH - torped[0].width) / 2;
      leftTorped.style.width  = torped[0].width;
      leftTorped.style.height = torped[0].height;
    }


  }
  function viuzalizationShips(){

    sh0.style.left = ships[0].x - pozitionPeriscop;
    sh0.style.top = ships[0].y;
    sh0.style.width = ships[0].width;
    sh0.style.height = ships[0].height;
    sh0.style.zIndex = Math.floor(ships[0].y);
    sh0.src = ships[0].src;

    sh1.style.left = ships[1].x - pozitionPeriscop;
    sh1.style.top = ships[1].y;
    sh1.style.width = ships[1].width;
    sh1.style.height = ships[1].height;
    sh1.style.zIndex = Math.floor(ships[1].y);
    sh1.src = ships[1].src;

    sh2.style.left = ships[2].x - pozitionPeriscop;
    sh2.style.top = ships[2].y;
    sh2.style.width = ships[2].width;
    sh2.style.height = ships[2].height;
    sh2.style.zIndex = Math.floor(ships[2].y);
    sh2.src = ships[2].src;

    sh3.style.left = ships[3].x - pozitionPeriscop;
    sh3.style.top = ships[3].y;
    sh3.style.width = ships[3].width;
    sh3.style.height = ships[3].height;
    sh3.style.zIndex = Math.floor(ships[3].y);
    sh3.src = ships[3].src;

    sh4.style.left = ships[4].x - pozitionPeriscop;
    sh4.style.top = ships[4].y;
    sh4.style.width = ships[4].width;
    sh4.style.height = ships[4].height;
    sh4.style.zIndex = Math.floor(ships[4].y);
    sh4.src = ships[4].src;

    sh5.style.left = ships[5].x - pozitionPeriscop;
    sh5.style.top = ships[5].y;
    sh5.style.width = ships[5].width;
    sh5.style.height = ships[5].height;
    sh5.style.zIndex = Math.floor(ships[5].y);
    sh5.src = ships[5].src;
  }



}
*/

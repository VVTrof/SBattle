// глобальные переменные и константы
var startLevel = 1,
    FRAME_RATE = 50;
var TORPED_WIDTH = 20,
    TORPED_HEIGHT = 60;
var SHIP_WIDTH = 200;
    SHIP_HEIGHT = 100;
var YANDEX_MONEY = false;
// объекты "торпеды""
{var torpedComments = {
    x :      "координата X (левый край торпеды)",
    y :      "координата Y (верхний край торпеды)",
    width :  "ширина торпеды",
    height:  "длина торпеды",
    speed:   "скорость торпеды",
    visible: "видимость торпеды (true/false)",
    kof:     "изменение скорости торпеды в зависимости от применения модулей улучшения"
  };
  var lTorped = {
    x : techParam[1].leftTorpedsX,
    y : 800,
    width : TORPED_WIDTH,
    height: TORPED_HEIGHT,
    speed: techParam[1].leftTorpedSpeed,
    visible: false,
    kof: 1
    };
  var cTorped = {
    x : techParam[1].centerTorpedsX,
    y : 800,
    width : TORPED_WIDTH,
    height: TORPED_HEIGHT,
    speed: techParam[1].centerTorpedSpeed,
    visible: false,
    kof: 1
  };
  var rTorped = {
    x : techParam[1].rightTorpedsX,
    y : 800,
    width : TORPED_WIDTH,
    height: TORPED_HEIGHT,
    speed: techParam[1].rightTorpedSpeed,
    visible: false,
    kof: 1
  };
  var torped = [torpedComments,lTorped, cTorped, rTorped];
};
// прототипы кораблей
{var warShipProtoComments = {
  name          : "название корабля",
  src           : "картинка движения направо",
  reversSrc     : "картинка движения налево",
  destroySrc    : "картинка уничтожения корабля",
  destroyRevSrc : "картинка уничтожения корабля, движущегося налево",
  fireSrc       : "картинка повреждения корабля",
  health        : "количество жизней корабля (1 до 20, торпеда бьет на 10)",
  identity      : "принадлежность корабля (true - свой, false - чужой)",
  type          : "движение корабля 'simple' - горизонтально 'diag' -до края зоны и потом прямолинейно, 'zigzag' - "+
                  "значение скорости меняется на противоположный при соприкосновении с краем зоны",
  x             : "координата x (левый край изображения)",
  y             : "координата y (верхний край изображения)",
  width         : "длина корабля. рекомендовано 200",
  height        : "высота корабля. рекомендовано 100",
  speedX        : "горизонтальная скорость корабля",
  speedY        : "вертикальная скорость корабля",
  speedIndivid  : "коэфициент, определяющий скорость от максимальной в этом уровне (от 0.01 до 1 (100%))",
  vectorLeft    : "'true' - если плывёт направо, 'false' - если плывёт налево"
  }
 var warShip1Proto = {
  src           : "images/ship_1/ship.png",
  reversSrc     : "images/ship_1/ship2.png",
  destroySrc    : "images/ship_1/ship.png",
  destroyRevSrc : "images/ship_1/ship2.png",
  fireSrc       : "картинка повреждения корабля",
  health        : 10,
  identity      : false,
  type          : "simple",
  x             : 0,
  y             : 800,
  width         : 200,
  height        : 100,
  speedX        : 0,
  speedY        : 0,
  speedIndivid  : 1,
  vectorLeft    : true
  }
 var warShip1Proto = [warShipProtoComments,warShip1Proto];
}

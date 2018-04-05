// глобальные переменные и констант
export const FRAME_RATE = 20;
export const TORPED_WIDTH = 20;
export const TORPED_HEIGHT = 60;
export const YANDEX_MONEY = false;
export const SHIP_TYPES = 10;
// координата начала видимого пространства по  X
export const X_MIN = -300;
// координата начала видимого пространства по  X
export const X_MAX = 1100;
// размер по вертикали игрового поля
export const Y_MAX = 800;

// прототипы кораблей
var warShipProtoComments = {
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
  currentWidth  : "длина корабля c учётом дальности от ПЛ.",
  currentHeight : "высота корабляc с учётом дальности от ПЛ.",
  speedX        : "горизонтальная скорость корабля",
  speedY        : "вертикальная скорость корабля",
  speedIndivid  : "коэфициент, определяющий скорость от максимальной в этом уровне (от 0.01 до 1 (100%))",
  vectorLeft    : "'true' - если плывёт направо, 'false' - если плывёт налево",
  rangeFactor   : "коэффициент для расчета размера объекта в зависимости от его дальности от ПЛ (от 1 до 0.1)"
  }
 var warShip1Proto = {
  name          : "Крейсер",
  src           : "images/ship_1/ship.png",
  reversSrc     : "images/ship_1/ship2.png",
  destroySrc    : "images/ship_1/ship.png",
  destroyRevSrc : "images/ship_1/ship2.png",
  fireSrc       : "images/ship_1/ship2.png",
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
  vectorLeft    : true,
  rangeFactor   : 1
}
var warShip2Proto = {
 name          : "Танкер",
 src           : "images/ship_1/ship.png",
 reversSrc     : "images/ship_1/ship2.png",
 destroySrc    : "images/ship_1/ship.png",
 destroyRevSrc : "images/ship_1/ship2.png",
 fireSrc       : "images/ship_1/ship2.png",
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
 vectorLeft    : true,
 rangeFactor   : 1
 }
 var warShip3Proto = {
  name          : "Корабль снабжения",
  src           : "images/ship_1/ship.png",
  reversSrc     : "images/ship_1/ship2.png",
  destroySrc    : "images/ship_1/ship.png",
  destroyRevSrc : "images/ship_1/ship2.png",
  fireSrc       : "images/ship_1/ship2.png",
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
  vectorLeft    : true,
  rangeFactor   : 1
}

export var warShipProto = [warShipProtoComments,warShip1Proto,warShip2Proto,warShip3Proto];

//База данных уровней
var levelComments = {
  text                  : "задачи миссии",
  prizeOil              : "количество призового топлива",
  prizeDetails          : "количество призовых деталей",
  prizeMoney            : "количество призовых денег",
  maxShips              : "максимальное количество вражеских и своих кораблей на экране до 6-ти",
  target                : "требуется поразить целей",
  numberOfShips         : "количество кораблей в миссии",

  warShip1              : "количество кораблей 1 типа",
  warShip1Prize         : "вознаграждение за корабль 1 типа",
  warShip2              : "количество кораблей 2 типа",
  warShip2Prize         : "вознаграждение за корабль 2 типа",
  warShip3              : "количество кораблей 3 типа",
  warShip3Prize         : "вознаграждение за корабль 3 типа",
  warShip4              : "количество кораблей 4 типа",
  warShip4Prize         : "вознаграждение за корабль 4 типа",
  warShip5              : "количество кораблей 5 типа",
  warShip5Prize         : "вознаграждение за корабль 5 типа",
  warShip6              : "количество кораблей 6 типа",
  warShip6Prize         : "вознаграждение за корабль 6 типа",
  warShip7              : "количество кораблей 7 типа",
  warShip7Prize         : "вознаграждение за корабль 7 типа",
  warShip8              : "количество кораблей 8 типа",
  warShip8Prize         : "вознаграждение за корабль 8 типа",
  warShip9              : "количество кораблей 9 типа",
  warShip9Prize         : "вознаграждение за корабль 9 типа",
  warShip10             : "количество кораблей 10 типа",
  warShip10Prize        : "вознаграждение за корабль 10 типа",

  shipMaxY              : "самая ближняя координата по Y, рекомендуется 500, не больше 600",
  shipMinY              : "самая ближняя координата по Y, рекомендуется 350, не больше 300",
  gorizontY             : "линия горизонта (стандарт - 300)",
  speedShipsMin         : "минимальная горизонтальная скорость корабля от 0.1",
  speedShipsMax         : "максимальная горизонтальная скорость кораблей от 0.1",
  speedShipsMaxY        : "максимальная вертикальная скорость кораблей от 0.1",
  delayNewShip          : "пауза перед появлением следующего корабля",

  seaSrc                : "адрес картинки моря 1500 на 800, море начинается от линии горизонта",
  skySrc                : "адрес картинки неба 1100 на 300, небо накладывается сверху моря ",
  landSrc               : "адрес картинки земли 1100 на 400, земля идёт верхним слоем",
};

var level1 = {
  text                  : "Конвой 10 кораблей",
  prizeOil              : 10,
  prizeDetails          : 10,
  prizeMoney            : 100,
  maxShips              : 2,
  target                : 5,
  numberOfShips         : 10,

  warShip1              : 10,
  warShip1Prize         : 1,
  warShip2              : 0,
  warShip2Prize         : 0,
  warShip3              : 0,
  warShip3Prize         : 0,
  warShip4              : 0,
  warShip4Prize         : 0,
  warShip5              : 0,
  warShip5Prize         : 0,
  warShip6              : 0,
  warShip6Prize         : 0,
  warShip7              : 0,
  warShip7Prize         : 0,
  warShip8              : 0,
  warShip8Prize         : 0,
  warShip9              : 0,
  warShip9Prize         : 0,
  warShip10             : 0,
  warShip10Prize        : 0,

  shipMaxY              : 500,
  shipMinY              : 350,
  gorizontY             : 300,
  speedShipsMin         : 0.1,
  speedShipsMax         : 5,
  speedShipsMaxY        : 0.1,
  delayNewShip          : 100,

  seaSrc                : "images/sea/sea1.jpg",
  skySrc                : "images/sky/sky1.png",
  landSrc               : "images/land/land3.png"
};
var level2 = {
  text                  : "Конвой 10 кораблей",
  prizeOil              : 10,
  prizeDetails          : 10,
  prizeMoney            : 100,
  maxShips              : 2,
  target                : 5,
  numberOfShips         : 10,

  warShip1              : 10,
  warShip1Prize         : 1,
  warShip2              : 0,
  warShip2Prize         : 0,
  warShip3              : 0,
  warShip3Prize         : 0,
  warShip4              : 0,
  warShip4Prize         : 0,
  warShip5              : 0,
  warShip5Prize         : 0,
  warShip6              : 0,
  warShip6Prize         : 0,
  warShip7              : 0,
  warShip7Prize         : 0,
  warShip8              : 0,
  warShip8Prize         : 0,
  warShip9              : 0,
  warShip9Prize         : 0,
  warShip10             : 0,
  warShip10Prize        : 0,

  shipMaxY              : 500,
  shipMinY              : 350,
  gorizontY             : 300,
  speedShipsMin         : 0.1,
  speedShipsMax         : 5,
  speedShipsMaxY        : 0.1,
  delayNewShip          : 100,

  seaSrc                : "images/sea/sea2.png",
  skySrc                : "images/sky/sky2.png",
  landSrc               : "images/land/land1.png"
};
var level3 = {
  text                  : "Конвой 10 кораблей",
  prizeOil              : 10,
  prizeDetails          : 10,
  prizeMoney            : 100,
  maxShips              : 2,
  target                : 5,
  numberOfShips         : 10,

  warShip1              : 10,
  warShip1Prize         : 1,
  warShip2              : 0,
  warShip2Prize         : 0,
  warShip3              : 0,
  warShip3Prize         : 0,
  warShip4              : 0,
  warShip4Prize         : 0,
  warShip5              : 0,
  warShip5Prize         : 0,
  warShip6              : 0,
  warShip6Prize         : 0,
  warShip7              : 0,
  warShip7Prize         : 0,
  warShip8              : 0,
  warShip8Prize         : 0,
  warShip9              : 0,
  warShip9Prize         : 0,
  warShip10             : 0,
  warShip10Prize        : 0,

  shipMaxY              : 500,
  shipMinY              : 350,
  gorizontY             : 300,
  speedShipsMin         : 0.1,
  speedShipsMax         : 5,
  speedShipsMaxY        : 0.1,
  delayNewShip          : 100,

  seaSrc                : "images/sea/sea3.png",
  skySrc                : "images/sky/sky3.png",
  landSrc               : "images/land/emptyland.png"
};
var level = [levelComments, level1, level2, level3];

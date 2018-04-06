function makeLevels(firstLevel) {
    var level = firstLevel
    var object = {}
    object.level = level;
    object.current = function () {
        return object.level
    };
    object.next = function () {
     	  object.level = object.level + 1;
      	return object.level
    };

    return object
  }

  var player1level = makeLevels(1);
  var player2level = makeLevels(10);

  console.log(player1level.current())

  console.log(player1level.next())
  console.log(player1level.level)
  player1level.level = 23
  console.log(player1level.current())

  /////////////////////////////////////////////////////////
  <html>
<head>
</head>
<body>
  <h1>тестовый тест!</h1>
  <script>

  // level.js
  var level = 0
  export function next() {
    level++;
    return level
  }
  export function currentLevel() {
    return level
  }
  // game.js
  import {level} from './level.js'
  export function start() {
    // ...


  // start.js
  import {level} from './level.js'
  import {start} from './game.js'

  </script>
</body>
</html>

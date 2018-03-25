//вызов функции выполнения титульной страницы при первом запуске
window.onload = function(){coverPage();}
//функция выполнения титульной страницы
function coverPage(){
  //для исключения повторного нажатия на кнопки buttonRules и buttonInfo
  var lastClick;
  visualCoverPage();

  //  функции-обработчики кнопок
  buttonRules.onclick = function(){
    var current_opacity   = +infoGame.style.opacity,
        direction_opacity = "reduction";
    if (lastClick!="rules"){
      buttonRules.src = "images/buttons/buttonRulesOn.png";
      buttonInfo.src  = "images/buttons/buttonInfoOff.png";
      //плавно убирает и выводит окно infoGame
      var timer = setInterval(function(){
        if (current_opacity >  0    && direction_opacity == "reduction") {
          current_opacity = current_opacity-0.01};
        if (current_opacity <  0.7  && direction_opacity == "increase")  {
          current_opacity = current_opacity+0.01};
        if (current_opacity >= 0.7  && direction_opacity == "increase")  {
          clearInterval(timer)};
        if (current_opacity <= 0.01 && direction_opacity == "reduction") {
          direction_opacity = "increase";
          document.getElementById('infoGame').innerText = "Вы управляете подводной лодкой." +
            " В Вашем распоряжении три торпедных аппарата и 300 торпед боекомплекта." +
            " Запуск торпед производится путём нажатия клавиш 'z' ''x' и 'c' "+
            " поворот перископа - клавиши 'left' и 'right'"
          };
        infoGame.style.opacity = current_opacity;
      },10);
      lastClick = "rules";
    }
  }

  buttonInfo.onclick  = function(){
    var current_opacity   = +infoGame.style.opacity,
        direction_opacity = "reduction";
    if (lastClick!="info"){
      buttonRules.src = "images/buttons/buttonRulesOff.png";
      buttonInfo.src  = "images/buttons/buttonInfoOn.png";
      //плавно убирает и выводит окно infoGame
      var timer = setInterval(function(){
        if (current_opacity >  0    && direction_opacity == "reduction")  {
          current_opacity = current_opacity-0.01};
        if (current_opacity <  0.7  && direction_opacity == "increase")   {
          current_opacity = current_opacity+0.01};
        if (current_opacity >= 0.7  && direction_opacity == "increase")   {
          clearInterval(timer)};
        if (current_opacity <= 0.01 && direction_opacity == "reduction")  {
          direction_opacity = "increase";
          document.getElementById('infoGame').innerText = "последние изменения:"+
          "три торпедных аппарата, количество кораблей до шести (можно "+
          "увеличить) \n сейчас работаю над: алгоритм проверки попадания,"+
          "вывод кораблей на модуль сонар. \n предложения и пожелания можно "+
          "отправить на почту: vvtrof@gmail.com"
          };
        infoGame.style.opacity = current_opacity;
      },10);
      lastClick = "info";
    }
  }

  buttonOff.onclick   = function(){
    var result = confirm("Вы хотите покинуть игру?");
    if (result == true) window.close();
  }

  buttonUp.onclick    = function(){
    if (startLevel<3) {startLevel++};
    document.getElementById('beginLvl').innerText = startLevel + " level";
  }

  buttonDown.onclick  = function(){
    if (startLevel>1) {startLevel--};
    document.getElementById('beginLvl').innerText = startLevel+" level";
  }

  buttonStart.onclick = function(){
    hideCoverPage();
    // Будут направления: в ангар, на базу и на карту
    game(startLevel,1);  //задаем миссию и номер пл
  }

  //визуализируем объекты титульной страницы и скрываем другие объекты
  function visualCoverPage(){
    titulPage.style.visibility = "visible";
    loading.style.zIndex       = 1; loading.style.visibility   = "hidden";
    fonTitulPage.style.zIndex  = 1;
    buttonStart.style.zIndex   = 2;
    buttonOff.style.zIndex     = 2;
    buttonUp.style.zIndex      = 2;
    buttonDown.style.zIndex    = 2;
    infoGame.style.zIndex      = 2; infoGame.style.opacity     = 0;
    beginLvl.style.zIndex      = 3;
    buttonRules.style.zIndex   = 3;
    buttonInfo.style.zIndex    = 3;
    indLvlTitul.style.zIndex   = 3;
    if (YANDEX_MONEY) {
      money.style.zIndex       = 3; money.style.opacity        = 0.8;
    }
  }

  //скрываем объекты титульной страницы
  function hideCoverPage(){
    titulPage.style.visibility = "hidden";
  }
}

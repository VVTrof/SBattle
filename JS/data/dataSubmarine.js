// технические характеристики подводных лодок.

// технические характеристики кораблей. комментарии.
const techParamComments = {
  leftTorpedMax: 'максимальное количество торпед в левом торпедоприёмнике от 0 до 100',
  leftTorpedSpeed: 'скорострельность левого торпедного аппарата от 0 до 10',
  leftTorpeds: 'количество торпед в левом торпедном аппарате',
  leftTorpedsX: 'координата Х левого торпедного аппарата , рекомендовано 190',

  rightTorpedMax: 'максимальное количество торпед в правом торпедоприёмнике от 0 до 100',
  rightTorpedSpeed: 'скорострельность правого торпедного аппарата от 0 до 10',
  rightTorpeds: 'количество торпед в правом торпедном аппарате',
  rightTorpedsX: 'координата Х правого торпедного аппарата , рекомендовано 590',

  centerTorpedMax: 'максимальное количество торпед в центральном торпедоприёмнике от 0 до 100',
  centerTorpedSpeed: 'скорострельность центрального торпедного аппарата от 0 до 10',
  centerTorpeds: 'количество торпед в центральном торпедном аппарате',
  centerTorpedsX: 'координата Х центрального торпедного аппарата , рекомендовано 390',

  maxFuel: 'вместимость топливного бака',
  fuel: 'количество топлива в баке',
  maxRotatePeriscop: 'максимальный поворот перископа. Не более 300',
  speedRotatePeriscop: 'скорость поворота перископа',
};
// технические характеристики подводных лодок. ПЛ1.
var techParam1 = {
  leftTorpedMax         : 10,  //от 0 до 100
  leftTorpedSpeed       : 2,  // от 0 до 10
  leftTorpeds           : 99,
  leftTorpedsX          : 190,

  rightTorpedMax        : 10,
  rightTorpedSpeed      : 2,
  rightTorpeds          : 99,
  rightTorpedsX         : 590,

  centerTorpedMax       : 10,
  centerTorpedSpeed     : 3,
  centerTorpeds         : 99,
  centerTorpedsX        : 390,

  maxFuel               : 100,  //от 100 до 2000
  fuel                  : 100,
  maxRotatePeriscop     : 300,
  speedRotatePeriscop   : 10    //от 0 до 10

};
// технические характеристики подводных лодок. ПЛ2.
var techParam2 = {
  leftTorpedMax         : 10,  //от 0 до 100
  leftTorpedSpeed       : 2,  // от 0 до 10
  leftTorpeds           : 99,
  leftTorpedsX          : 190,

  rightTorpedMax        : 10,
  rightTorpedSpeed      : 2,
  rightTorpeds          : 99,
  rightTorpedsX         : 590,

  centerTorpedMax       : 10,
  centerTorpedSpeed     : 3,
  centerTorpeds         : 99,
  centerTorpedsX        : 390,

  maxFuel               : 100,  //от 100 до 2000
  fuel                  : 100,
  maxRotatePeriscop     : 300,
  speedRotatePeriscop   : 10    //от 0 до 10

};
// технические характеристики подводных лодок. ПЛ3.
var techParam3 = {
  leftTorpedMax         : 10,  //от 0 до 100
  leftTorpedSpeed       : 2,  // от 0 до 10
  leftTorpeds           : 99,
  leftTorpedsX          : 190,

  rightTorpedMax        : 10,
  rightTorpedSpeed      : 2,
  rightTorpeds          : 99,
  rightTorpedsX         : 590,

  centerTorpedMax       : 10,
  centerTorpedSpeed     : 3,
  centerTorpeds         : 99,
  centerTorpedsX        : 390,

  maxFuel               : 100,  //от 100 до 2000
  fuel                  : 100,
  maxRotatePeriscop     : 300,
  speedRotatePeriscop   : 10    //от 0 до 10

};
var techParam = [techParamComments,techParam1,techParam2,techParam3]

//если авторизация пройдена успешно - загружаем данные о ангаре с сервера или локалхоста (поначалу)

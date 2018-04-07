// технические характеристики подводных лодок.

// технические характеристики кораблей. комментарии.
// максимальное количество торпед в левом торпедоприёмнике от 0 до 100:
// leftTorpedMax
// скорострельность левого торпедного аппарата от 0 до 10:
// leftTorpedSpeed
// количество торпед в левом торпедном аппарате:
// leftTorpeds
// координата Х левого торпедного аппарата , рекомендовано 190:
// leftTorpedsX
// максимальное количество торпед в правом торпедоприёмнике от 0 до 100:
// rightTorpedMax
// скорострельность правого торпедного аппарата от 0 до 10:
// rightTorpedSpeed
// количество торпед в правом торпедном аппарате:
// rightTorpeds
// координата Х правого торпедного аппарата , рекомендовано 590:
// rightTorpedsX
// максимальное количество торпед в центральном торпедоприёмнике от 0 до 100:
// centerTorpedMax
// скорострельность центрального торпедного аппарата от 0 до 10:
// centerTorpedSpeed
// количество торпед в центральном торпедном аппарате:
// centerTorpeds
// координата Х центрального торпедного аппарата , рекомендовано 390:
// centerTorpedsX
// maxFuel: 'вместимость топливного бака',
// fuel: 'количество топлива в баке',
// maxRotateperiscope: 'максимальный поворот перископа. Не более 300',
// speedRotateperiscope: 'скорость поворота перископа' от 0 до 10,

// технические характеристики подводных лодок. ПЛ1.
export let techParam = [];
techParam[0] = {
  leftTorpedMax         : 10,
  leftTorpedSpeed       : 2,
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

  maxFuel               : 100,
  fuel                  : 100,
  maxRotateperiscope     : 300,
  speedRotateperiscope   : 10,
};
// технические характеристики подводных лодок. ПЛ2.
techParam[1] = {
  leftTorpedMax         : 10,
  leftTorpedSpeed       : 2,
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

  maxFuel               : 100,
  fuel                  : 100,
  maxRotateperiscope     : 300,
  speedRotateperiscope   : 10,
};
// технические характеристики подводных лодок. ПЛ3.
techParam[2] = {
  leftTorpedMax         : 10,
  leftTorpedSpeed       : 2,
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

  maxFuel               : 100,
  fuel                  : 100,
  maxRotateperiscope     : 300,
  speedRotateperiscope   : 10,
};
// если авторизация пройдена успешно - загружаем данные о ангаре с сервера или локалхоста (поначалу)

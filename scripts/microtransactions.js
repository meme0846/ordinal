"use strict"
function mtxUpg(n) {
  switch (n) {
    case 0:
      if (game.mtx.money >= 25) {
        game.mtx.money -= 25
        game.mtx.doublerTicks += 120 * 1000
      }
      break
    case 1:
      if (game.mtx.money >= 60) {
        game.mtx.money -= 60
        game.lastTick -= 60 * 1000
      }
      break
    case 2:
      if (game.mtx.money >= 1000) {
        game.mtx.money -= 1000
        
        if (game.ord.b > 60) game.ord.b = Math.ceil(game.ord.b * 0.95)
        else game.mtx.doubleIncs = true
      }
      break
  }
}

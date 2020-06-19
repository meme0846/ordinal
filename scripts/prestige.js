function prestige() {
  game.prestigePoints = game.prestigePoints.plus(game.ord.toNumberWithBase(100))
  game.prestiges = game.prestiges.plus(1)

  game.ord = new Ordinal(nD(0), 100 - game.baseReductions)

  updateTabs()
}

function getBaseReductionCost(n) {
  if (game.ord.b <= 3) return new ExpantaNum(Infinity)

  return ExpantaNum.pow(10, game.baseReductions).times(100)
}

function reduceBase() {

  let cost = getBaseReductionCost(game.baseReductions)

  if (game.prestigePoints.gte(cost)) {
    game.prestigePoints = game.prestigePoints.minus(cost)
    game.baseReductions = game.baseReductions.plus(1)

    game.ord = new Ordinal(0, 100 - game.baseReductions)
    game.prestigePoints = new ExpantaNum(0)
    game.incrementors.amount = new ExpantaNum(0)
    game.incrementors.cost = new ExpantaNum(10)
  }
}

"use strict"
const setIncrementorCost = () => {
  game.incrementors.cost = D.pow(2, game.incrementors.amount.div(D.pow(1.1, game.scaling[0].amount))).times(10)
}

function setScalingCosts() {
  const highestScaling = 1

  for (const i in game.scaling) {
    game.scaling[i].cost = D.pow(10 * (10 ** i), D.pow(2, 
      game.scaling[i].amount.div(i < highestScaling ? nD(1.1).pow(game.scaling[Math.max(i + 1, highestScaling)].amount) : 1)
    ))
  }
}


function buyIncrementor() {
  if (game.prestigePoints.gte(game.incrementors.cost)) {
    game.incrementors.amount = game.incrementors.amount.plus(1)
    game.prestigePoints = game.prestigePoints.minus(game.incrementors.cost)

    setIncrementorCost()
  }
}

function maxIncrementors() {
  const stuff = calculateMax(nD(10), nD(2), game.incrementors.amount, game.prestigePoints, D.pow(1.1, game.scaling[0].amount))

  if (stuff.amount.gte(1)) {
    game.incrementors.amount = game.incrementors.amount.plus(stuff.amount)
    setIncrementorCost()
    game.prestigePoints = game.prestigePoints.minus(stuff.cost)
  }
}

function buyScalingReduction(n) {
  if (game.prestigePoints.gte(game.scaling[n].cost)) {
    game.scaling[n].amount = game.scaling[n].amount.plus(1)
    game.prestigePoints = game.prestigePoints.minus(game.scaling[n].cost)

    setScalingCosts()
    setIncrementorCost()
  }
}


// spook zone
function calculateMax(cost, costMult, have, currency, scalingDivisor) { // eslint-disable-line
  const mult = D.pow(10, costMult.log10().div(scalingDivisor))

  const actualStart = cost.times(D.pow(mult, have))
  const canBuy = mult.eq(1) ? currency.div(cost).floor() 
    : D.floor(currency.div(actualStart).mul(mult.sub(1)).add(1).log10().div(mult.log10())) // thanks to break_infinity.js


  const multThing = mult.eq(1) ? canBuy : D.div(mult.pow(nD(0).minus(canBuy.minus(1))).times(mult.pow(canBuy.minus(1)).minus(1)), mult.minus(1)).plus(1)
  const chost = cost.times(D.pow(mult, canBuy.plus(have))).times(multThing)

  return {
    amount: canBuy,
    cost: chost.minus(currency)
  }
}

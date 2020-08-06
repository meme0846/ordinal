"use strict"
const setIncrementorCost = () => {
  const mult = D.pow(10, nD(2).log10().div(getScalingEffect(-1))).max(calcScalingCap())
  
  game.incrementors.cost = D.pow(mult, game.incrementors.amount).times(10)
}

function setScalingCost(i) {
  const mult = D.pow(10, nD(2).log10().div(getScalingEffect(i))).max(calcScalingCap())

  game.scaling[i].cost = D.pow(10 ** (i + 1), D.pow(mult, game.scaling[i].amount)).div(get13rCheapening())
}

function setScalingCosts() {
  setScalingCost(3)
  setScalingCost(2)
  setScalingCost(1)
  setScalingCost(0)
} 

function setMpCost() {
  game.mpCost = D.pow(10, D.pow(calcMpCostScaling(), game.multiplierPoints).times(10))
}

function calcMpCostScaling() {
	let yourMom = nD(1.1)

	if (milestonesCompleted() >= 18) yourMom = D.pow(10, yourMom.log10().div(game.scaling[3].amount.plus(1).pow(0.05)))

	return yourMom.max(calcScalingCap())
}

const getScalingEffect = i =>
  (i < 3 ? D.pow(Math.max(0.1, i * 0.1) + 1, game.scaling[i + 1].amount) : 1)

function get13rCheapening() {
  if (milestonesCompleted() < 7) return nD(1)
  return game.baseReductions.pow(2).times(5)
}

function buyIncrementor() {
  if (game.prestigePoints.gte(game.incrementors.cost)) {
    game.incrementors.amount = game.incrementors.amount.plus(1)
    if (game.prestigePoints.lt("ee6")) game.prestigePoints = game.prestigePoints.minus(game.incrementors.cost)

    setIncrementorCost()
  }

  updateMultPow()
}

function maxIncrementors(max = null) {
  if (game.prestigePoints.gte(getBaseReductionCost(game.baseReductions)) && game.options.disableMaxWhenReductable) return

  const stuff = calculateMax(nD(10), nD(2), game.incrementors.amount, game.prestigePoints, D.pow(1.1, game.scaling[0].amount), calcScalingCap(), max)

  if (stuff.amount.gte(1)) {
    game.incrementors.amount = game.incrementors.amount.plus(stuff.amount)
    if (game.prestigePoints.lt("ee6")) game.prestigePoints = game.prestigePoints.minus(stuff.cost)
    setIncrementorCost()
  }

  updateMultPow()
}

function buyScalingReduction(n) {
  if (game.prestigePoints.gte(game.scaling[n].cost)) {
    game.scaling[n].amount = game.scaling[n].amount.plus(1)
    game.prestigePoints = game.prestigePoints.minus(game.scaling[n].cost)

    setScalingCosts()
    setIncrementorCost()
	}
	
	setMpCost()
}

function maxScaling(n, max) {
  if (game.prestigePoints.gte(getBaseReductionCost(game.baseReductions)) && game.options.disableMaxWhenReductable) return

  const scaling = game.scaling[n]
  const base = D.pow(10, nD(2).log10().div(getScalingEffect(n))).max(calcScalingCap())

  const canBuy = game.prestigePoints.times(get13rCheapening()).max(0.00001).log10().div(n + 1).max(0.00001).logBase(base).plus(1).floor()

  scaling.amount = scaling.amount.plus(canBuy.minus(scaling.amount).min(max)).max(scaling.amount)
	setScalingCost(n)
	setMpCost()
}

function maxAllScalings(max) {
  maxScaling(3, max)
  maxScaling(2, max)
  maxScaling(1, max)
  maxScaling(0, max)
}

function buyMultiplierPoint() {
  if (game.prestigePoints.gte(game.mpCost)) {
    game.multiplierPoints = game.multiplierPoints.plus(1)
		game.prestigePoints = game.prestigePoints.minus(game.mpCost)
		
		setMpCost()
  }

  updateMultPow()
}

function maxMultiplierPoints(max) {
  const canBuy = game.prestigePoints.max(0.00001).log10().div(10).max(0.00001).logBase(calcMpCostScaling()).plus(1).floor()

	if (canBuy.gte(game.multiplierPoints)) game.multiplierPoints = game.multiplierPoints.plus(canBuy.minus(game.multiplierPoints).min(max))

	setMpCost()
  updateMultPow()
}

function updateMultPow() {
  if (game.multiplierPoints.plus(calcFreeMultPts()).gte(game.bestMp)) game.bestMp = game.multiplierPoints.plus(calcFreeMultPts())

  let b = game.bestMp
  for (const i in game.multipliers) b = b.minus(game.multipliers[i].points)
  game.multiplierPower = b
}


// spook zone (do not touch unless you know whta youre doing)
// (spoiler alert: you do not yahtzee, please stop thinking about 'fixing' this)
function calculateMax(cost, costMult, have, currency, scalingDivisor, scalingMax = null, max = null) { // eslint-disable-line
  let mult = D.pow(10, costMult.log10().div(scalingDivisor))
  if (scalingMax !== null) mult = mult.max(scalingMax)

  const actualStart = cost.times(D.pow(mult, have))
  const maxBuy = mult.eq(1) ? currency.div(cost).floor() 
    : D.floor(currency.div(actualStart).mul(mult.sub(1)).add(1).log10().div(mult.log10())) // thanks to break_infinity.js for code on this line
  const canBuy = (max === null) ? maxBuy : maxBuy.min(max)


  const multThing = mult.eq(1) ? canBuy : D.div(mult.pow(nD(0).minus(canBuy.minus(1))).times(mult.pow(canBuy.minus(1)).minus(1)), mult.minus(1)).plus(1)
  const chost = cost.times(D.pow(mult, have.plus(canBuy.minus(1)))).times(multThing).floor()

  return {
    amount: canBuy,
    cost: chost // idk what im doing
  }
}

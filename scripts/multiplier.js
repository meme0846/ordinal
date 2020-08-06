"use strict"
class Multiplier {
  constructor(scaling, cost, free) {
    this.scaling = scaling
    this.baseCost = cost
    this.cost = cost

		this.blevel = nD(0)
		this.free = free
    this.exp = nD(0)

    this.points = nD(0)
  }

  addPoints(n) {
    const delta = D.min(game.multiplierPower, n)

    this.points = this.points.plus(delta)
    game.multiplierPower = game.multiplierPower.minus(delta)
  }

  removePoints(n) {
    const delta = D.min(this.points, n)

    this.points = this.points.minus(delta)
    game.multiplierPower = game.multiplierPower.plus(delta)
  }

  tick(mult) {
    if (this.points.gt(0)) this.exp = this.exp.plus(calculateMultPowerSynergy().pow(this.points.minus(1)).times(mult).times(calculateExpMult()))

    const stuff = calculateMax(this.baseCost, this.scaling, this.blevel, this.exp, nD(1))

    this.blevel = this.blevel.plus(stuff.amount)
    this.exp = this.exp.minus(stuff.cost)
    this.cost = this.baseCost.times(D.pow(this.scaling, this.blevel))
	}
	
	get level() {
		return this.blevel.plus(this.free()).times(calcMultEffectiveness())
	}
}

function calculateTotalMultPow() {
  let thing = game.multiplierPower

  for (const i in game.multipliers) thing = thing.plus(game.multipliers[i].points)

  return thing
}

function calculateMultPowerSynergy() {
  let yourmom = nD(1.1)

	const level = game.multipliers.synergy.level
	const idk = calculateSynergyCapDelay().times(150)

  if (milestonesCompleted() >= 14 && level.gte(50)) {
    if (level.lte(idk)) yourmom = yourmom.plus(level.minus(49).times(0.01))
    else yourmom = yourmom.plus(level.minus(idk.minus(1)).pow(0.75).plus(idk.minus(50)).times(0.01))
  }

  return yourmom
}

function calculateExpMult() {
	let abc = nD(1)

	if (milestonesCompleted() >= 17) abc = abc.times(game.prestigePoints.pow(0.1).plus(10).logBase(10))
	if (calculateRewardAmount(3).gt(0)) abc = abc.times(game.ord.toNumberWithBase(100).plus(10).log10().plus(10).log10().pow(calculateRewardAmount(3).plus(1)))


	abc = abc.times(game.bankedExp.pow(0.25).times(game.wuantumUpgrades.upgrades[13].have - 0).max(1))

	return abc
}

function calculateSynergyCapDelay() {
	return nD(1.25).pow(game.multiplierReset.times)
}

function reverseArithmeticThing(n) {
	return n.plus(0.1).times(8).plus(1).pow(0.5).minus(1).div(2).floor()
}

function calculateRewardAmount(n) {
	const thing = reverseArithmeticThing(game.multiplierReset.times).div(4).floor()
	const remainder = reverseArithmeticThing(game.multiplierReset.times).mod(4)

	return thing.plus((remainder > n) - 0) // boolean math boolean math boolean math
}

function freeSynergyLevels() {
	let urMom = nD(0)

	if (milestonesCompleted() >= 20) urMom = urMom.plus(game.multiplierReset.times.times(4))

	return urMom
}

function freeScalingLevels() {
	let urMom = nD(0)

	if (calculateRewardAmount(0).gt(0)) {
		urMom = urMom.plus(D.pow(calculateRewardAmount(0).pow(0.05).times(0.32).plus(1), game.prestigePoints.plus(2).logBase(2).plus(2).logBase(2)))
	}

	return urMom
}

function freeSwisdomLevels() {
	return nD(0)
}

function calculateTotalMultLevel() {
	let sum = nD(0)

	for (const i in game.multipliers) sum = sum.plus(game.multipliers[i].level)

	return sum
}

function calcMultEffectiveness() {
	let thing = nD(1)

	thing = thing.times(D.pow(1.05, calculateRewardAmount(1)))

	return thing
}

function distributeExp(idk) {
	if (idk.eq(0)) return

	const urmom = calculateMultPowerSynergy().pow(game.multiplierPower.minus(1)).times(calculateExpMult()).times(idk.pow(0.1)).div(1e10)

	for (const i in game.multipliers) {
		const mult = game.multipliers[i]
		mult.exp = mult.exp.plus(urmom)
		mult.tick(0)
	}
}

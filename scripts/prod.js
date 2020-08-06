"use strict"
function getIncrementorProd(total = false) {
  const usedAmount = game.incrementors.amount.plus(calcFreeIncrementors()).pow(game.mtx.doubleIncs * 0.025 + 1)

	let sing = D.pow(calcReductionBoost(), game.baseReductions)
	
	const milestone2thing = nD(0.1).plus(nD(0.01).times(game.baseReductions.times((milestonesCompleted() >= 4) - 0)))

  sing = sing.times(usedAmount.times(milestone2thing
    .times((milestonesCompleted() >= 1) - 0))
		.plus(1)
		.pow(D.pow(1.2, calculateRewardAmount(2)))
	)
	
	if (game.wuantumUpgrades.upgrades[12].have) sing = sing.times(milestone2thing
			.times((milestonesCompleted() >= 1) - 0)
			.plus(1)
			.pow(D.pow(1.2, calculateRewardAmount(2)))
			.pow(game.incrementors.amount.max(1).logBase(2).pow(2)).max(1)
		)

  const scalingMultBoost = game.multipliers.scaling.level.times(0.06)

  if (milestonesCompleted() >= 8) sing = sing
    .times(game.scaling[0].amount.plus(1).pow(scalingMultBoost.plus(0.25)))
    .times(game.scaling[1].amount.plus(1).pow(scalingMultBoost.plus(0.5)))
    .times(game.scaling[2].amount.plus(1).pow(scalingMultBoost.plus(0.75)))
    .times(game.scaling[3].amount.plus(1).pow(scalingMultBoost.plus(1)))

  if (milestonesCompleted() >= 13) for (const i in game.multipliers) sing = sing.times(game.multipliers[i].level.plus(2).logBase(2))

	sing = sing.times(getMultPointBoost())

	if (game.wuantums.gt(0)) sing = sing.times(4)
	
	if (game.multipliers.swisdom.level.gte(60)) sing = sing.pow(game.multipliers.synergy.level.pow(0.35).times(game.baseReductions.minus(73).pow(0.5)).times(0.01).plus(1).max(1))


	// uwuantum stuwuff
	sing = sing.times(game.bankedExp.pow(0.8).times(game.wuantumUpgrades.upgrades[13].have - 0).max(1))


  const final = sing

  if (!total) return final

  return usedAmount.times(final)
}

function calcReductionBoost() {
	const level = game.multipliers.synergy.level
	const idk = calculateSynergyCapDelay().times(50)

  if (level.gte(idk)) return nD(2).times(nD(1.01).pow(level.minus(idk).pow(0.8 + (milestonesCompleted() >= 19) / 11).plus(idk)))
  return nD(2).times(D.pow(1.01, level))
}

function calcMultPointBoost() {
  return calcReductionBoost() // pro gaming
}

function getMultPointBoost() {
  return D.pow(calcMultPointBoost(), game.multiplierPoints.plus(calcFreeMultPts()))
}

function calcScalingCap() {
	let thign = nD(1.1)
	
	const level = game.multipliers.scaling.level

  if (level.gte(100)) thign = thign.minus(level.minus(100).min(100) * 0.0009)

  return thign
}

function calcFreeIncrementors() {
  return game.multipliers.swisdom.level.div(50).plus(1).pow(calculateTotalMultLevel()).minus(1)
}

function calcFreeMultPts() {
  let idk = nD(0)

  if (milestonesCompleted() >= 16) idk = idk.plus(game.incrementors.amount.plus(0.0001).logBase(100))

  return idk
}

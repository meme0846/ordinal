"use strict"
class Automator {
  constructor(trigger, fungtion) {
    this.triggerPoint = trigger
    this.charge = nD(0) // yes, you will have meny charge
    this.points = nD(0)

    this.exec = fungtion
  }

  removePoints(n) { // no addPoints because yes
    this.points = this.points.minus(n).max(0)

    game.autoPower = calcAutoPower(false)
  }

  tick(time) {
    this.charge = this.charge.plus(this.points.times(calcChargeGain()).times(time))

    const max = this.charge.div(this.triggerPoint).floor()
    this.charge = this.charge.mod(this.triggerPoint)

    this.exec(max)
  }

  get perSec() {
    return this.points.times(calcChargeGain()).div(this.triggerPoint)
  }
}

function calcAutoPower(rTotal) {
  const reductions = game.baseReductions.minus(20)

  let total = reductions.div(3).floor().plus(1).max(0).plus(game.wuantums)

  if (rTotal) return total

  for (const i in game.automators) total = total.minus(game.automators[i].points)

  return total
}

function nextAutoPower() {
  return calcAutoPower(true).minus(game.wuantums).times(3).plus(20)
}

function giveAutomationPower(automator, n) {
  const allocate = D.min(game.autoPower, n)

  automator.points = automator.points.plus(allocate)

  game.autoPower = calcAutoPower(false)
}

function calcChargeGain() {
	let urmom = D.pow(2, game.multipliers.swisdom.level).times(game.wuantums.gt(0) * 99 + 1)

	urmom = urmom.times(game.bankedExp.pow(0.5).times(game.wuantumUpgrades.upgrades[13].have - 0).max(1))
	
	return urmom
}

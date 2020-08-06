"use strict"
class WuantumUpg {
	constructor(parentid = null) {
		this.cost = null
		this.factor = null
		this.parent = parentid

		this.wuarks = nD(0)
		this.have = false
	}

	get canBuy() {
		return game.wuarks.gte(this.cost.times(game.wuantumUpgrades.factor)) && (this.parent === null || game.wuantumUpgrades[parent].have) && !this.have
	}

	buy() {
		if (this.canBuy) {
			const factor = game.wuantumUpgrades.factor
			const realCost = this.cost.times(factor)
			game.wuarks = game.wuarks.minus(realCost)
			this.wuarks = realCost
			this.have = true
			game.wuantumUpgrades.factor = factor.times(this.factor)
		}
	}

	respec() {
		this.have = false

		game.wuarks = game.wuarks.plus(this.wuarks)
		this.wuarks = nD(0)
	}
}

class WuantumData {
	constructor(cost, factor, desc, id) { // eslint-disable-line 
		this.cost = nD(cost)
		this.factor = nD(factor)
		this.desc = desc
		this.id = id
	}
}

const wuantumUpgData = {
	11: new WuantumData(1, 2, "Increase PP gain base by 5", 11),
	12: new WuantumData(1, 2, "2 reduction milestone is slightly multiplicative (uneffected by free incrementors and effective incrementor boosts)", 12),
	13: new WuantumData(2, 1, "Get a multiplier to EXP gain, incrementor production, and automator charge based on banked EXP", 13),
	14: new WuantumData(1e100, 1.5, "die irl", 14)
}

function setWuantumUpgStuff() {
	for (const i in game.wuantumUpgrades.upgrades) {
		const upg = game.wuantumUpgrades.upgrades[i]

		upg.cost = wuantumUpgData[i].cost
		upg.factor = wuantumUpgData[i].factor
	}
}

function respecWuantumUpgrades() {
	wuantum(false)
	for (const i in game.wuantumUpgrades.upgrades) game.wuantumUpgrades.upgrades[i].respec()
	game.wuantumUpgrades.factor = nD(1)
}

"use strict"
function prestige() {
  game.prestigePoints = game.prestigePoints.plus(ppGain())
  game.prestiges = game.prestiges.plus(1)

  game.ord = new Ordinal(nD(0), 100 - game.baseReductions)

  game.mtx.boostEnabled = false

  updateTabs()
}

function getBaseReductionCost(n) {
  if (game.ord.b <= 10) return nD(Infinity) // you cant reduce the base any further

  const ppGagn = [nD(100), nD(1000), nD(1e4), nD(5e4), nD(2.5e5), nD(1e6), nD(5e6), nD(2e7), nD(7.5e7), nD(2e8), nD(6e8), nD(2e9)]

  if (ppGagn[n] !== undefined) return ppGagn[n] // values

  const n2electricBoogaloo = nD(n - ppGagn.length)

	// spaghetti zone
	// i really need to just shove 90 values into pp gagn instead of this mess
	// so, todo, ig
  if (n < 23) return nD(5e9).times(D.pow(4, n2electricBoogaloo.pow(1.25)))
  if (n < 28) return getBaseReductionCost(22).pow(D.pow(1.125, n.minus(22)))
  if (n < 35) return getBaseReductionCost(nD(27)).pow(D.pow(1.1, n.minus(27)))
  if (n < 40) return nD(1e98).pow(D.pow(1.05, n.minus(35)))
  if (n < 44) return nD(1e230).pow(D.pow(1.075, n.minus(40)))
  if (n < 56) return nD("1e400").pow(D.pow(1.075, n.minus(44)))
  if (n < 62) return nD("1e1200").pow(D.pow(1.1, n.minus(56)))
	if (n < 65) return nD("1e2050").pow(D.pow(1.1, n.minus(62)))
	if (n < 69) return nD("1e2660").pow(D.pow(1.07, n.minus(65)))
	if (n < 73) return nD("1e4000").pow(D.pow(1.1, n.minus(69)))
	if (n < 77) return nD("1e24000").pow(D.pow(1.875, n.minus(73)))
	if (n < 79) return nD("1e240000").pow(D.pow(1.35, n.minus(77)))
	if (n < 82) return nD("e2.88e6").pow(D.pow(1.84, n.minus(79)))
	if (n < 85) return nD("e1.27e7").pow(D.pow(1.42, n.minus(82).pow(0.79)))
	if (n < 86) return nD("e3.4e7")
	if (n < 89) return nD("e6e8").pow(D.pow(2.45, n.minus(86).pow(0.625)))
	return nD("e1.06e11")
}

function reduceBase(idk = nD(1)) {
	if (idk.lt(1)) return
  const cost = getBaseReductionCost(game.baseReductions)

  if (game.prestigePoints.gte(cost)) {
    game.baseReductions = game.baseReductions.plus(1)

    game.ord = new Ordinal(0, 100 - game.baseReductions)
    game.prestigePoints = nD(0)

    for (const i in game.scaling) {
      const s = game.scaling[i]

      s.amount = nD(0)
      s.cost = nD(10).pow((i - 0) + 1)
    }

    game.incrementors.amount = nD((milestonesCompleted() >= 5) - 0)

    game.multiplierPoints = nD(0)
    game.mpCost = nD(1e10)

    game.mtx.boostEnabled = false

    setScalingCosts()
    setIncrementorCost()
  }

  updateTabs()
}

function calcMultResetCost() {
	/* if (game.multiplierReset.times.lt(5))*/ return nD(3000).times(D.pow(1.12, game.multiplierReset.times))
	
	// return nD(3000).times(D.pow(1.12, 5)).pow(D.pow(1.1, game.multiplierReset.times.minus(5)))
	// just gonna remove scaling for now
}

function resetMults() {
	if (calculateTotalMultLevel().gte(calcMultResetCost())) {
		for (const i in game.multipliers) {
			game.multipliers[i].exp = nD(game.bankedExp)
			game.multipliers[i].blevel = nD(0)
		}

		game.multiplierReset.times = game.multiplierReset.times.plus(1)
	}
}

function ppGain() {
	let thing = game.ord.toNumberWithBase(ppGainBase())

	const scaLevel = game.multipliers.scaling.level

	if (scaLevel.gte(2000)) thing = thing.pow(scaLevel.minus(2000).pow(0.3).times(0.025).plus(1))

	return thing
}

function wuantum(idkwhattoname = true) {
	if (idkwhattoname) {
		game.wuantums = game.wuantums.plus(1)
		game.wuarks = game.wuarks.plus(wuarkGain())
		game.bankedExp = game.bankedExp.plus(calcBankedExpGain())
	}

  game.baseReductions = nD(0)

  game.ord = new Ordinal(0, 100 - game.baseReductions)
  game.prestigePoints = nD(0)

  for (const i in game.scaling) {
      const s = game.scaling[i]

      s.amount = nD(0)
      s.cost = nD(10).pow((i - 0) + 1)
	}
		
	for (const i in game.multipliers) {
			game.multipliers[i].exp = nD(game.bankedExp)
			game.multipliers[i].blevel = nD(0)
			game.multipliers[i].points = nD(0)
	}

	for (const i in game.automators) game.automators[i].points = nD(0)
	game.autoPower = nD(0)

	game.multiplierReset.times = nD(0)

  game.incrementors.amount = nD((milestonesCompleted() >= 5) - 0)

	game.multiplierPoints = nD(0)
	game.bestMp = nD(0)
  game.multiplierPower = nD(0)
  game.mpCost = nD(1e10)

	game.mtx.boostEnabled = false

  setScalingCosts()
	setIncrementorCost()
	
	updateTabs()
}

function wuarkGain() {
	return D.pow(1.3, game.prestigePoints.plus(1).log10().plus(1).log10().minus(11)).floor()
}

function calcBankedExpGain() {
	let product = nD(1)

	for (const i in game.multipliers) product = product.times(game.multipliers[i].level.plus(1))

	return product
}

function ppGainBase() {
	return 100 + game.wuantumUpgrades.upgrades[11].have * 5
}

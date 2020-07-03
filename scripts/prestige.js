"use strict"
function prestige() {
  game.prestigePoints = game.prestigePoints.plus(game.ord.toNumberWithBase(100))
  game.prestiges = game.prestiges.plus(1)

  game.ord = new Ordinal(nD(0), 100 - game.baseReductions)

  updateTabs()
}

function getBaseReductionCost(n) {
  const ppGagn = [nD(100), nD(1000), nD(1e4), nD(5e4), nD(2.5e5), nD(1e6), nD(5e6), nD(2e7), nD(7.5e8), nD(2e8), nD(6e8), nD(2e9)]

  if (game.ord.b <= 3) return nD(Infinity) // you cant reduce the base any further

  if (ppGagn[n] !== undefined) return ppGagn[n] // values

  return D.pow(10, Math.ceil((n - 2) * ((n - 11) ** 0.25))) // algorithmic generation (needs meny work)
}

function reduceBase() {
  const cost = getBaseReductionCost(game.baseReductions)

  if (game.prestigePoints.gte(cost)) {
    game.prestigePoints = game.prestigePoints.minus(cost)
    game.baseReductions = game.baseReductions.plus(1)

    game.ord = new Ordinal(0, 100 - game.baseReductions)
    game.prestigePoints = nD(0)

    for (const i in game.scaling) {
      const s = game.scaling[i]

      s.amount = nD(0)
      s.cost = nD(10).pow((i - 0) + 1)
    }

    game.incrementors.amount = nD((milestonesCompleted() >= 5) - 0)
    setIncrementorCost()
  }
}

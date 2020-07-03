"use strict"
function updateTabs() {
  document.documentElement.style.setProperty("--tabAmount", 1 + game.prestiges.gte(1))
}

function toNotation(n, p = 1, p2 = 2) {
  if (n.lt(1e4)) return n.toFixed(p)
  if (n.isInfinite()) return "bigger than ur mom lol"

  const e = n.logBase(10).floor()
  const m = n.div(D.pow(10, e)).toFixed(p2)

  return `${m}e${e}`
}

// its in ui because i dont know where else to put it
function milestonesCompleted() {
  const reducs = game.baseReductions

  return reducs.gte(2) + reducs.gte(4) + reducs.gte(5) + reducs.gte(7) + reducs.gte(8) + reducs.gte(10)
}

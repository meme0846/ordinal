function updateTabs() {
  document.documentElement.style.setProperty("--tabAmount", 1 + game.prestiges.gte(1))
}

function toNotation(n, p = 1, p2 = 2) {
  if (n.lt(1e4)) return n.toFixed(p)

  let e = n.logBase(10).floor()
  let m = n.div(D.pow(10, e)).toFixed(p2)

  return m + "e" + e
}
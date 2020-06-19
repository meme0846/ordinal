function buyIncrementor() {
  if (game.prestigePoints.gte(game.incrementors.cost)) {
    game.incrementors.amount = game.incrementors.amount.plus(1)
    game.prestigePoints = game.prestigePoints.minus(game.incrementors.cost)
    game.incrementors.cost = D.pow(2, game.incrementors.amount).times(10)
  }
}

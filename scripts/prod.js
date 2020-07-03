"use strict"
function getIncrementorProd() {
  return D.pow(2, game.baseReductions)
    .times(game.incrementors.amount.times(nD(0.1).plus(
      nD(0.01).times(game.baseReductions.times((milestonesCompleted() >= 4) - 0)))
      .times((milestonesCompleted() >= 1) - 0))
    )
}

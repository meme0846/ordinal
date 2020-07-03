"use strict"
const D = ExpantaNum
const nD = x => new D(x)


// game class
class Game {
  constructor() {
    // ord
    this.ord = new Ordinal(0, 100)

    // prestige
    this.prestigePoints = nD(0)
    this.prestiges = nD(0)

    // incrementors
    this.incrementors = {
      amount: nD(0),
      cost: nD(10)
    }

    // base prestige
    this.baseReductions = nD(0) // it decimal time, baybee

    // scaling
    this.scaling = [{
      amount: nD(0),
      cost: nD(10)
    }, {
      amount: nD(0),
      cost: nD(100)
    }]


    // timers
    this.lastTick = Date.now()

    // ui
    this.tab = 0
  }
}


// init
let app
let game

function init() {
  game = new Game()

  app = new Vue({
    el: "#app",
    data: {
      game,
      toNotation,
      baseCost: getBaseReductionCost,
      milestones: milestonesCompleted,

      prod: {
        inc: getIncrementorProd
      }
    }
  })
  
  load()
  
  updateTabs()

  setScalingCosts()
  setIncrementorCost()


  // gameloop
  setInterval(() => {
    const newTick = Date.now()
    const mult = (newTick - game.lastTick) / 1000
    game.lastTick = newTick

    game.ord.n = game.ord.n.plus(game.incrementors.amount.times(getIncrementorProd()).times(mult))
  }, 100)

  // saving
  setInterval(save, 6969)


  // ui
  document.getElementById("app").style.display = "block"
  document.getElementById("preloader").style.display = "none"
}

init()

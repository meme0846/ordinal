"use strict"
class Ordinal {
  constructor(n, b) {
    this.n = new ExpantaNum(n) 
    this.b = b
  }


  get string() {
    const arr = [this.n]

    while (arr[arr.length - 1].gte(this.b)) {
      const last = arr[arr.length - 1]
      const div = D.floor(last.div(this.b))

      arr[arr.length - 1] = last.minus(div.times(this.b))
      arr.push(div)
    }

    const formattedArr = []

    for (const i in arr) 
      if (arr[i].neq(0)) 
        formattedArr.push(`${i === "0" ? "" : "&omega;"}${i > 1 ? `<sup>${i < this.b ? i : new Ordinal(i, this.b).string()}</sup>` : ""}${(arr[i].neq(1) || i === "0") ? arr[i].toFixed(1) : ""}`)

    const thing = formattedArr.reverse().join("+")

    return thing === "" ? 0 : thing
  }

  get stringWithBase() {
    return `${this.string}[${this.b}]`
  }


  toNumberWithBase(b) {
    const arr = [this.n]

    while (arr[arr.length - 1].gte(this.b)) {
      const last = arr[arr.length - 1]
      const div = D.floor(last.div(this.b))

      arr[arr.length - 1] = last.minus(div.times(this.b))
      arr.push(div)
    }

    const array = []
    for (const i in arr) array.push(arr[i].times(nD(b).pow(i < this.b ? i : new Ordinal(i, this.b).toNumberWithBase(b))))

    let sum = nD(0)
    for (const i in array) sum = sum.plus(array[i])

    return sum
  }
}

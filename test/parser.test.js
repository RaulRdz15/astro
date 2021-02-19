import assert from "assert"
import parse, { syntaxIsOkay } from "../src/parser.js"

const goodPrograms = [
  `meow("meow")`,

  `to pounce fibonacci(n: lick) {
    scratch a, b = 0, 1
    purr b < n {
      a, b = b, a + b
    }
    hairball b
  }`,

  `scratch num~lives = 4 + 5
   fur life in lives {
      meow("AI IS ALIVVVVVVEEEE ")
      litter
   } `,

  `to pounce next(n: lick) { hairball n + 1}
  next(100)`,
]

const badPrograms = [`irgbroeuigbeishdlfkjsdhlfkshdlfksgf`]

describe("The Syntax Checker", () => {
  for (let program of goodPrograms) {
    it(`accepts the good program starting with ${program.slice(0, 32)}`, () => {
      assert.ok(syntaxIsOkay(program))
    })
  }
  for (let program of badPrograms) {
    it(`rejects the good program starting with ${program.slice(0, 32)}`, () => {
      assert.ok(!syntaxIsOkay(program))
    })
  }
})

describe("The Parser", () => {
  for (let program of goodPrograms) {
    it(`accepts the good program starting with ${program.slice(0, 32)}`, () => {
      assert.ok(parse(program))
    })
  }
  for (let program of badPrograms) {
    it(`rejects the good program starting with ${program.slice(0, 32)}`, () => {
      assert.throws(() => parse(program))
    })
  }
})

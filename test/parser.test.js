import assert from "assert"
import parse from "../src/parser.js"

const goodPrograms = [
  `meow("meow")`,
  `to pounce fiboancci(n: lick) {
    scratch a, b = 0, 1
    purr b < n {
      a, b = b, a + b
    }
    hairball b
  }`,
  `scratch num~lives = 4 + 5`,
]

const badPrograms = [`irgbroeuigbeishdlfkjsdhlfkshdlfksgf`]

describe("The Parser", () => {
  for (let program of goodPrograms) {
    it(`accepts the good program starting with ${program.slice(10)}`, () => {
      assert.ok(parse(program))
    })
  }
  for (let program of badPrograms) {
    it(`rejects the good program starting with ${program.slice(10)}`, () => {
      assert.ok(!parse(program))
    })
  }
})

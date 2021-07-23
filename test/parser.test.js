import assert from "assert"
import * as ast from "../src/ast.js"
import parse, { syntaxIsOkay } from "../src/parser.js"

const syntaxChecks = [
  ["all numeric literal forms", "meow (8 * 89.123)"],
  ["complex expressions", "print (83 * ((((((((-13 / 21)))))))) + 1 - -0)"],
  ["non-Latin letters in identifiers", "scratch コンパイラ = 100"],
]

const syntaxErrors = [
  ["malformed number", "scratch x= 2.", /Line 1, col 10:/],
  ["a missing right operand", "meow (5 -)", /Line 1, col 10:/],
  ["a non-operator", "meow (7 * ((2 _ 3))", /Line 1, col 15:/],
  ["an expression starting with a )", "meow ())", /Line 1, col 7:/],
  ["a statement starting with expression", "x * 5", /Line 1, col 3:/],
  ["an illegal statement on line 2", "meow (5\nx * 5)", /Line 2, col 3:/],
  ["a statement starting with a )", "meow (5\n) * 5)", /Line 2, col 1:/],
  ["an expression starting with a *", "scratch x = * 71", /Line 1, col 9:/],
]

const source = `scratch dozen = 1 * (0 + 101.3)
  scratch y = dozen - 0    // TADA 🥑
  dozen = 0 / y
  meow (dozen)`

const expectedAst = new ast.Program([
  new ast.VariableDeclaration(
    "dozen",
    new ast.BinaryExpression("*", 1, new ast.BinaryExpression("+", 0, 101.3))
  ),
  new ast.VariableDeclaration(
    "y",
    new ast.BinaryExpression("-", Symbol.for("dozen"), 0)
  ),
  new ast.Assignment(
    Symbol.for("dozen"),
    new ast.BinaryExpression("/", 0, Symbol.for("y"))
  ),
  new ast.PrintStatement(Symbol.for("dozen")),
])

describe("The parser", () => {
  for (const [scenario, source] of syntaxChecks) {
    it(`recognizes that ${scenario}`, () => {
      assert(parse(source))
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => parse(source), errorMessagePattern)
    })
  }
  it("produces the expected AST for all node types", () => {
    assert.deepStrictEqual(parse(source), expectedAst)
  })
})

const goodPrograms = [
  `meow("meow")`,

  `to pounce fibonacci(n: lives) {
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

  `to pounce next(n: lives) { hairball n + 1}
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

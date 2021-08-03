import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import * as ast from "../src/ast.js"

// Programs that are semantically correct
const semanticChecks = [
  ["variable declarations", 'scratch x = 1 scratch y = "false"'],
//   ["complex array types", "function f(x: [[[int?]]?]) {}"],        ??
  ["increment and decrement", "scratch x = 10 x-- x++"],
//   ["initialize with empty array", "scratch a = [](of int);"],          ??
//   ["assign arrays", "scratch a = [](of int);scratch b=[1];a=b;b=a;"],    ??
//   ["initialize with empty optional", "scratch a = no int;"],       ??
  ["short return", "to pounce void f() { hairball }"],
  ["long return", "to pounce ponder f() { hairball true }"],
//   ["assign optionals", "scratch a = no int;scratch b=some 1;a=b;b=a;"],
//   ["return in nested if", "to pounce f() {if true {return;}}"],
//   ["break in nested if", "while false {if true {break;}}"],
//   ["long if", "if true {print(1);} else {print(3);}"],
//   ["else if", "if true {print(1);} else if true {print(0);} else {print(3);}"],
//   ["for over collection", "for i in [2,3,5] {print(1);}"],
//   ["for in range", "for i in 1..<10 {print(0);}"],
//   ["repeat", "repeat 3 {scratch a = 1; print(a);}"],
//   ["conditionals with ints", "print(true ? 8 : 5);"],
//   ["conditionals with floats", "print(1<2 ? 8.0 : -5.22);"],
//   ["conditionals with strings", 'print(1<2 ? "x" : "y");'],
//   ["??", "print(some 5 ?? 0);"],
//   ["nested ??", "print(some 5 ?? 8 ?? 0);"],
//   ["||", "print(true||1<2||false||!true);"],
//   ["&&", "print(true&&1<2&&false&&!true);"],
//   ["bit ops", "print((1&2)|(9^3));"],
//   ["relations", 'print(1<=2 && "x">"y" && 3.5<1.2);'],
//   ["ok to == arrays", "print([1]==[5,8]);"],              ??
//   ["ok to != arrays", "print([1]!=[5,8]);"],               ??
//   ["shifts", "print(1<<3<<5<<8>>2>>0);"],
//   ["arithmetic", "scratch x=1;print(2*3+5**-3/2-5%8);"],
//   ["array length", "print(#[1,2,3]);"],
//   ["optional types", "scratch x = no int; x = some 100;"],
//   ["variables", "scratch x=[[[[1]]]]; print(x[0][0][0][0]+2);"],
//   ["recursive structs", "struct S {z: S?} scratch x = S(no S);"],
//   ["nested structs", "struct T{y:int} struct S{z: T} scratch x=S(T(1)); print(x.z.y);"],
//   ["member exp", "struct S {x: int} scratch y = S(1);print(y.x);"],
//   ["subscript exp", "scratch a=[1,2];print(a[0]);"],
//   ["array of struct", "struct S{} scratch x=[S(), S()];"],                   ??
//   ["struct of arrays and opts", "struct S{x: [int] y: string??}"],             ??
//   ["assigned functions", "to pounce f() {}\nscratch g = f;g = f;"],
//   ["call of assigned functions", "to pounce f(x: int) {}\nscratch g=f;g(1);"],
//   ["type equivalence of nested arrays", "function f(x: [[int]]) {} print(f([[1],[2]]));"],        ??
//   [
//     "call of assigned function in expression",
//     `to pounce f(x: int, y: boolean): int {}
//     scratch g = f;
//     print(g(1, true));
//     f = g; // Type check here`,
//   ],
//   [
//     "pass a function to a function",
//     `to pounce f(x: int, y: (boolean)->void): int { return 1; }
//      to pounce g(z: boolean) {}
//      f(2, g);`,
//   ],
//   [
//     "function return types",
//     `to pounce square(x: int): int { return x * x; }
//      to pounce compose(): (int)->int { return square; }`,
//   ],
//   ["function assign", "to pounce f() {} scratch g = f; scratch h = [g, f];"],
//   ["struct parameters", "struct S {} function f(x: S) {}"],                ??
//   ["array parameters", "function f(x: [int?]) {}"],                         ??
//   ["optional parameters", "to pounce f(x: [int], y: string?) {}"],
//   ["built-in constants", "print(25.0 * π);"],
//   ["built-in sin", "print(sin(π));"],
//   ["built-in cos", "print(cos(93.999));"],
//   ["built-in hypot", "print(hypot(-4.0, 3.00001));"],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
//   ["non-distinct fields", "struct S {x: boolean x: int}", /Fields must be distinct/],
  ["non-int increment", "scratch x=false x++", /an integer, found boolean/],
//   ["non-int decrement", 'scratch x=some[""] x++', /an integer, found [string]?/],
  ["undeclared id", "scratch(x)", /Identifier x not declared/],
  ["redeclared id", "scratch x = 1 scratch x = 1 ", /Identifier x already declared/],
//   ["recursive struct", "struct S { x: int y: S }", /must not be recursive/],
//   ["assign to const", "const x = 1;x = 2;", /Cannot assign to constant x/],
  ["assign bad type", "scratch x=1 x=true ", /Cannot assign a boolean to a int/],
//   ["assign bad array type", "scratch x=1;x=[true];", /Cannot assign a \[boolean\] to a int/],          ??
//   ["assign bad optional type", "scratch x=1;x=some 2;", /Cannot assign a int\? to a int/],
//   ["break outside loop", "break;", /Break can only appear in a loop/],
//   [
//     "break inside function",
//     "while true {to pounce f() {break;}}",
//     /Break can only appear in a loop/,
//   ],
//   ["return outside function", "return;", /Return can only appear in a function/],
//   [
//     "return value from void function",
//     "to pounce f() {return 1;}",
//     /Cannot return a value here/,
//   ],
//   [
//     "return nothing from non-void",
//     "to pounce f(): int {return;}",
//     /should be returned here/,
//   ],
//   ["return type mismatch", "to pounce f(): int {return false;}", /boolean to a int/],
//   ["non-boolean short if test", "if 1 {}", /a boolean, found int/],
//   ["non-boolean if test", "if 1 {} else {}", /a boolean, found int/],
//   ["non-boolean while test", "while 1 {}", /a boolean, found int/],
//   ["non-integer repeat", 'repeat "1" {}', /an integer, found string/],
//   ["non-integer low range", "for i in true...2 {}", /an integer, found boolean/],
//   ["non-integer high range", "for i in 1..<no int {}", /an integer, found int\?/],
//   ["non-array in for", "for i in 100 {}", /Array expected/],               ??
//   ["non-boolean conditional test", "print(1?2:3);", /a boolean, found int/],
//   ["diff types in conditional arms", "print(true?1:true);", /not have the same type/],
//   ["unwrap non-optional", "print(1??2);", /Optional expected/],
//   ["bad types for ||", "print(false||1);", /a boolean, found int/],
//   ["bad types for &&", "print(false&&1);", /a boolean, found int/],
//   ["bad types for ==", "print(false==1);", /Operands do not have the same type/],
//   ["bad types for !=", "print(false==1);", /Operands do not have the same type/],
//   ["bad types for +", "print(false+1);", /number or string, found boolean/],
//   ["bad types for -", "print(false-1);", /a number, found boolean/],
//   ["bad types for *", "print(false*1);", /a number, found boolean/],
//   ["bad types for /", "print(false/1);", /a number, found boolean/],
//   ["bad types for **", "print(false**1);", /a number, found boolean/],
//   ["bad types for <", "print(false<1);", /number or string, found boolean/],
//   ["bad types for <=", "print(false<=1);", /number or string, found bool/],
//   ["bad types for >", "print(false>1);", /number or string, found bool/],
//   ["bad types for >=", "print(false>=1);", /number or string, found bool/],
//   ["bad types for ==", "print(2==2.0);", /not have the same type/],
//   ["bad types for !=", "print(false!=1);", /not have the same type/],
//   ["bad types for negation", "print(-true);", /a number, found boolean/],
//   ["bad types for length", "print(#false);", /Array expected/],                 ??
//   ["bad types for not", 'print(!"hello");', /a boolean, found string/],
//   ["non-integer index", "scratch a=[1];print(a[false]);", /integer, found boolean/],
//   ["no such field", "struct S{} scratch x=S(); print(x.y);", /No such field/],
//   ["diff type array elements", "print([3,3.0]);", /Not all elements have the same type/],   ??
//   ["shadowing", "scratch x = 1;\nwhile true {scratch x = 1;}", /Identifier x already declared/],
//   ["call of uncallable", "scratch x = 1;\nprint(x());", /Call of non-function/],
//   [
//     "Too many args",
//     "to pounce f(x: int) {}\nf(1,2);",
//     /1 argument\(s\) required but 2 passed/,
//   ],
//   [
//     "Too few args",
//     "to pounce f(x: int) {}\nf();",
//     /1 argument\(s\) required but 0 passed/,
//   ],
//   [
//     "Parameter type mismatch",
//     "to pounce f(x: int) {}\nf(false);",
//     /Cannot assign a boolean to a int/,
//   ],
//   [
//     "function type mismatch",
//     `to pounce f(x: int, y: (boolean)->void): int { return 1; }
//      to pounce g(z: boolean): int { return 5; }
//      f(2, g);`,
//     /Cannot assign a \(boolean\)->int to a \(boolean\)->void/,
//   ],
//   ["bad call to stdlib sin()", "print(sin(true));", /Cannot assign a boolean to a float/],
//   ["Non-type in param", "scratch x=1;to pounce f(y:x){}", /Type expected/],
//   ["Non-type in return type", "scratch x=1;to pounce f():x{return 1;}", /Type expected/],
//   ["Non-type in field type", "scratch x=1;struct S {y:x}", /Type expected/],
]

// Test cases for expected semantic graphs after processing the AST. In general
// this suite of cases should have a test for each kind of node, including
// nodes that get rewritten as well as those that are just "passed through"
// by the analyzer. For now, we're just testing the various rewrites only.

const Int = ast.Type.INT
const Void = ast.Type.VOID
const intToVoidType = new ast.FunctionType([Int], Void)

const varX = Object.assign(new ast.Variable("x", false), { type: Int })

const scratchX1 = new ast.VariableDeclaration(varX, 1n)
const assignX2 = new ast.Assignment(varX, 2n)

const functionF = new ast.FunctionDeclaration(
  Object.assign(new ast.Function("f", [new ast.Parameter("x", Int)], Void), {
    type: intToVoidType,
  }),
  []
)

const graphChecks = [
  ["Variable created & resolved", "scratch x=1; x=2;", [scratchX1, assignX2]],
  ["functions created & resolved", "to pounce f(x: int) {}", [functionF]]
]

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern)
    })
  }
  for (const [scenario, source, graph] of graphChecks) {
    it(`properly rewrites the AST for ${scenario}`, () => {
      assert.deepStrictEqual(analyze(parse(source)), new ast.Program(graph))
    })
  }
})
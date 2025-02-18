import ohm from "ohm-js"
import * as ast from "./ast.js"

const astroGrammar = ohm.grammar(String.raw`Astro {
  Program = Statement+
  Statement = Declaration | Assignment | Loop | Print | Break | Return | Call | Bump
  Declaration = VarDecl | FunDecl
  VarDecl = scratch IdList "=" ExpList
  FunDecl = to pounce (Type)? id "(" ListOf<Param, ","> ")" Body
  Type = "(" ListOf<Type, ","> ")" "->" Type              --function
       | typename                                         --typename
  Param  = id ":" typename
  Body = "{" Statement* "}"
  ExpList = ListOf<Exp,  ",">
  Assignment = IdList "=" ExpList
  Loop = ForLoop | WhileLoop
  ForLoop = fur id in Exp Body
  WhileLoop = purr Exp Body
  Print = meow "(" Exp ")"
  Break = litter
  IdList = id ("," id)*
  Return = hairball Exp                                   --return
         | hairball                                       --shortreturn
  Exp = Exp logop Joint                                   --binary
      | Joint
  Joint = Joint relop AddOp                               --binary
        | AddOp
  AddOp = AddOp addop Term                                --binary
        | Term
  Term = Term mulop Exponential                           --binary
       | Exponential
  Exponential = Factor "^" Exponential                    --binary
              | Factor
  Factor = ("-") Factor                                   --negation
         | ("!") Factor                                   --boolNegation
         | "(" Exp ")"                                    --parens
         | numlit
         | stringlit
         | boollit
         | id
  numlit = digit+ "." digit+                              --float
         | digit+                                         --int
  boollit = "true" | "false"
  stringlit = "\"" char* "\""
  logop = "&&" | "||"
  relop = "<=" | "<" | "==" | "!=" | ">=" | ">"
  addop = "+" | "-"
  mulop = "*"| "/"| "%"
  Call = id "(" ExpList ")"
  Bump = Exp ("++" | "--")

  typename = lives | yarn | ponder | void
  scratch = "scratch" ~idchar
  to = "to" ~idchar
  pounce = "pounce" ~idchar
  lives = "lives" ~idchar
  wiggle = "wiggle" ~idchar
  yarn = "yarn" ~idchar
  ponder = "ponder" ~idchar
  void = "void" ~idchar
  fur = "fur" ~idchar
  purr = "purr" ~idchar
  in = "in" ~idchar
  meow = "meow" ~idchar
  litter = "litter" ~idchar
  hairball = "hairball" ~idchar
  keyword = scratch | to | pounce | lives | yarn
          | ponder | fur | purr | meow | litter | hairball | void
  string = "\"" char* "\""
  char = ~"\"" any
  num = digit+
  idchar = letter | digit | "~"
  id = ~keyword letter idchar*
  space += "//" (~"\n" any)* ("\n" | end)  --comment
}
`)

const astBuilder = astroGrammar.createSemantics().addOperation("tree", {
  Program(statements) {
    return new ast.Program(statements.tree())
  },
  VarDecl(_scratch, identifiers, _eq, initializers) {
    const variables = identifiers.sourceString
      .split(/\s*,\s*/)
      .map((x) => new ast.Variable(x))
    return new ast.VariableDeclaration(variables, initializers.tree())
  },
  FunDecl(_to, _pounce, returnType, name, _left, params, _right, body) {
    return new ast.FunctionDeclaration(
      new ast.Function(
        name.sourceString,
        params.asIteration().tree(),
        returnType.tree()[0] ?? null
      ),
      body.tree()
    )
  },
  Type_function(_left, inTypes, _right, _arrow, outType) {
    return new ast.FunctionType(inTypes.asIteration().tree(), outType.tree())
  },
  Param(name, _colon, typename) {
    return new ast.Parameter(name.tree(), typename.tree())
  },
  Body(_left, statements, _right) {
    return statements.tree()
  },
  ExpList(expressions) {
    return expressions.asIteration().tree()
  },
  Return_shortreturn(_hairball) {
    return new ast.ShortReturnStatement()
  },
  Assignment(targets, _eq, sources) {
    return new ast.Assignment(targets.tree(), sources.tree())
  },
  ForLoop(_fur, iterator, _in, range, body) {
    return new ast.ForStatement(iterator.tree(), range.tree(), body.tree())
  },
  WhileLoop(_purr, test, body) {
    return new ast.WhileStatement(test.tree(), body.tree())
  },
  Print(_meow, _left, argument, _right) {
    return new ast.PrintStatement(argument.tree())
  },
  Break(_break) {
    return new ast.BreakStatement()
  },
  IdList(first, _commas, rest) {
    return [first.tree(), ...rest.tree()]
  },
  Return_return(_hairball, returnValue) {
    return new ast.ReturnStatement(returnValue.tree())
  },
  Exp_binary(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.tree(), right.tree())
  },
  Joint_binary(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.tree(), right.tree())
  },
  AddOp_binary(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.tree(), right.tree())
  },
  Term_binary(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.tree(), right.tree())
  },
  Exponential_binary(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.tree(), right.tree())
  },
  Factor_negation(op, operand) {
    return new ast.UnaryExpression(op.sourceString, operand.tree(), true)
  },
  Factor_boolNegation(op, operand) {
    return new ast.UnaryExpression(op.sourceString, operand.tree(), true)
  },
  Factor_parens(_left, exp, _right) {
    return exp.tree()
  },
  Call(callee, _left, args, _right) {
    return new ast.Call(callee.tree(), args.tree())
  },
  Bump(variable, operator) {
    return operator.sourceString === "++"
      ? new ast.Increment(variable.tree())
      : new ast.Decrement(variable.tree())
  },
  id(_first, _rest) {
    return new ast.IdentifierExpression(this.sourceString)
  },
  numlit_int(digits) {
    return Number(this.sourceString)
  },
  numlit_float(digits, dot, decimals) {
    return Number(this.sourceString)
  },
  stringlit(_left, chars, _right) {
    return chars.sourceString
  },
  boollit(bool) {
    return bool.sourceString === "true"
  },
  num(digits) {
    return Number(digits.sourceString)
  },
  string(_left, chars, _right) {
    return chars.sourceString
  },
  _terminal() {
    return this.sourceString
  },
})

export function syntaxIsOkay(sourceCode) {
  const match = astroGrammar.match(sourceCode)
  return match.succeeded()
}

export default function parse(sourceCode) {
  const match = astroGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return astBuilder(match).tree()
}

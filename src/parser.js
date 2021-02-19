import ohm from "ohm-js"
import * as ast from "./ast.js"

const astroGrammar = ohm.grammar(String.raw`Astro {
  Program = Statement+
  Statement = Declaration | Assignment | Loop | Print | Break | Return
  Declaration = VarDecl | FunDecl
  VarDecl = scratch IdList "=" ExpList
  FunDecl = to pounce id "(" Param* ")" Body
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
  Return = hairball Exp
  Exp = Exp ("+" | "<") Term     -- add
      | Term
  Term = num | id | Call | string
  Call = id "(" ExpList ")"

  typename = lick | wink | stare
  scratch = "scratch" ~idchar
  to = "to" ~idchar
  pounce = "pounce" ~idchar
  lick = "lick" ~idchar
  wiggle = "wiggle" ~idchar
  wink = "wink" ~idchar
  stare = "stare" ~idchar
  fur = "fur" ~idchar
  purr = "purr" ~idchar
  in = "in" ~idchar
  meow = "meow" ~idchar
  litter = "litter" ~idchar
  hairball = "hairball" ~idchar
  keyword = scratch | to | pounce | lick | wink
          | stare | fur | purr | meow | litter | hairball

  string = "\"" char* "\""
  char = ~"\"" any
  num = digit+
  idchar = letter | digit | "~"
  id = ~keyword letter idchar*
}
`)

const astBuilder = astroGrammar.createSemantics().addOperation("tree", {
  Program(statements) {
    return new ast.Program(statements.tree())
  },
  VarDecl(_scratch, identifiers, _eq, initializers) {
    return new ast.VariableDeclaration(identifiers.tree(), initializers.tree())
  },
  FunDecl(_to, _pounce, name, _left, parameters, _right, body) {
    return new ast.FunctionDeclaration(
      name.tree(),
      parameters.tree(),
      body.tree()
    )
  },
  Param(name, _colon, typename) {
    return new ast.Parameter(name.tree(), typename.tree())
  },
  Body(_left, statements, _right) {
    return statements.asIteration.tree()
  },
  Assignment(targets, _eq, sources) {},

  // Loop = ForLoop | WhileLoop
  // ForLoop = fur id in Exp Body
  // WhileLoop = purr Exp Body
  // Print = meow "(" Exp ")"
  // Break = litter
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

import ohm from "ohm-js"

const astroGrammar = ohm.grammar(String.raw`Astro {
  Program = Statement+
  Statement = Declaration | Assignment | Loop | Print | Break | Return
  Declaration = VarDecl | FunDecl
  VarDecl = scratch IdList "=" ExpList
  FunDecl = to pounce id Params Body
  Params = "(" Param* ")"
  Param  = id ":" typename
  typename = lick | wink | stare
  Body = "{" Statement* "}"
  ExpList = Exp ("," Exp)*
  Assignment = IdList "=" ExpList
  Loop = ForLoop | WhileLoop
  ForLoop = fur id in Exp Body
  WhileLoop = purr Exp Body
  Print = meow "(" Exp ")"
  Break = litter
  IdList = id ("," id)*
  Return = hairball Exp
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
  Exp = Exp ("+" | "<") Term     -- add
      | Term
  Term = num | id | Call | string
  string = "\"" char* "\""
  char = ~"\"" any
  Call = id "(" ExpList ")"
  num = digit+
  idchar = letter | digit | "~"
  id = ~keyword letter idchar*
}
`)

export default function parse(sourceCode) {
  const match = astroGrammar.match(sourceCode)
  return match.succeeded()
}

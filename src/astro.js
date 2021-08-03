#! /usr/bin/env node

import fs from "fs/promises"
import process from "process"
import compile from "./compiler.js"
import util from "util"

const help = `Astro compiler
Syntax: src/astro.js <filename> <outputType>
Prints to stdout according to <outputType>, which must be one of:
    ast        the abstract syntax tree
    analyzed   the semantically analyzed representation
    generate   the translation to JavaScript
`

async function compileFromFile(filename, outputType) {
  try {
    const buffer = await fs.readFile(filename)
    console.log(
      util.inspect(compile(buffer.toString(), outputType), { depth: 10 })
    )
  } catch (e) {
    console.error(`${e}`)
    process.exitCode = 1
  }
}

if (process.argv.length !== 4) {
  console.log(help)
} else {
  compileFromFile(process.argv[2], process.argv[3])
}

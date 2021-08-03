import { Type, FunctionType, Function} from "./ast.js"

function makeFunction(name, type) {
  return Object.assign(new Function(name), { type })
}

Type.BOOLEAN = Object.assign(new Type(), { description: "ponder" }),
Type.INT = Object.assign(new Type(), { description: "lives" }),
Type.FLOAT = Object.assign(new Type(), { description: "lives" }),
Type.STRING = Object.assign(new Type(), { description: "yarn" }),
Type.VOID = Object.assign(new Type(), { description: "void" }),
Type.ANY = Object.assign(new Type(), { description: "any" })

export const types = {
    int: Type.INT,
    float: Type.FLOAT,
    boolean: Type.BOOLEAN,
    string: Type.STRING,
    void: Type.VOID,
  }

export const functions = {
  meow: makeFunction("meow", new FunctionType([Type.ANY], Type.VOID))
}
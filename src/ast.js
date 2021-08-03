export class Program {
  constructor(statements) {
    this.statements = statements
  }
}

export class VariableDeclaration {
  constructor(variables, initializers) {
    Object.assign(this, { variables, initializers })
  }
}

export class Variable {
  // Generated when processing a variable declaration
  constructor(name) {
    Object.assign(this, { name })
  }
}

export class TypeDeclaration {
  constructor(type) {
    this.type = type
  }
}

export class Type {
  // Type of all basic type int, float, string, etc. and superclass of others
  constructor(description) {
    Object.assign(this, { description })
  }
}

// export class Type {
//   constructor(name) {
//     this.name = name
//   }
//   static BOOLEAN = new Type("ponder")
//   static INT = new Type("lives")
//   static FLOAT = new Type("lives")
//   static STRING = new Type("yarn")
//   static ANY = new Type("any")
//   // Equivalence: when are two types the same
//   isEquivalentTo(target) {
//     return this === target
//   }
//   // T1 assignable to T2 is when x:T1 can be assigned to y:T2. By default
//   // this is only when two types are equivalent; however, for other kinds
//   // of types there may be special rules.
//   isAssignableTo(target) {
//     return this.isEquivalentTo(target)
//   }
// }

export class ObjType extends Type {
  constructor(keyType, valueType) {
    let keyName = getObjName(keyType)
    let valueName = getObjName(valueType)
    super(`<${keyName}, ${valueName}>`)
    Object.assign(this, { keyType, valueType })
  }
  isEquivalentTo(target) {
    if (target === Type.EMPTY_OBJECT || this === Type.EMPTY_OBJECT) {
      return true
    }
    return (
      target.constructor === ObjType &&
      this.keyType.isEquivalentTo(target.keyType) &&
      this.valueType.isEquivalentTo(target.valueType)
    )
  }
}

export class FunctionDeclaration {
  // Example: function f(x: [int?], y: string): Vector {}
  constructor(fun, body) {
    Object.assign(this, { fun, body })
  }
}

export class Function {
  // Generated when processing a function declaration
  constructor(name, parameters, returnType) {
    Object.assign(this, { name, parameters, returnType })
  }
}

export class FunctionType extends Type {
  // Example: (boolean,[string]?)->float
  constructor(paramTypes, returnType) {
    super(`(${paramTypes.map(t => t.description).join(",")})->${returnType.description}`)
    Object.assign(this, { paramTypes, returnType })
  }
}

export class Parameter {
  constructor(name, type) {
    Object.assign(this, { name, type })
  }
}

export class Increment {
  // Example: count++
  constructor(variable) {
    this.variable = variable
  }
}

export class Decrement {
  // Example: count--
  constructor(variable) {
    this.variable = variable
  }
}

export class Assignment {
  // Example: a[z].p = 50 * 22 ** 3 - x
  constructor(target, source) {
    Object.assign(this, { target, source })
  }
}

export class BreakStatement {
  // Intentionally empty
}

export class ReturnStatement {
  // Example: return c[5]
  constructor(expression) {
    this.expression = expression
  }
}

export class ShortReturnStatement {
  // Intentionally empty
}

export class WhileStatement {
  // Example: while level != 90 { level += random(-3, 8); }
  constructor(test, body) {
    Object.assign(this, { test, body })
  }
}

export class ForStatement {
  // Example: for ball in balls { ball.bounce();  }
  constructor(iterator, collection, body) {
    Object.assign(this, { iterator, collection, body })
  }
}

export class BinaryExpression {
  // Example: 3 & 22
  constructor(op, left, right) {
    Object.assign(this, { op, left, right })
  }
}

export class PrintStatement {
  constructor(argument) {
    this.argument = argument
  }
}

export class IdentifierExpression {
  constructor(name) {
    this.name = name
  }
}

export class Call {
  constructor(callee, args) {
    Object.assign(this, { callee, args })
  }
}

export class UnaryExpression {
  constructor(op, operand, isprefix) {
    Object.assign(this, { op, operand, isprefix })
  }
}

export class Bool extends Type {
  constructor(name, value, type) {
    super(name)
    Object.assign(this, { name, value, type })
  }
}

// export class Field {
//   constructor(name, type) {
//     Object.assign(this, { name, type })
//   }
// }
export class Program {
  constructor(statements) {
    this.statements = statements
  }
}

export class FunctionDeclaration {
  constructor(name, parameters, body) {
    Object.assign(this, { name, parameters, body })
  }
}

export class VariableDeclaration {
  constructor(variables, initializers) {
    Object.assign(this, { variables, initializers })
  }
}

export class Parameter {
  constructor(name, type) {
    Object.assign(this, { name, type })
  }
}

export class Assignment {
  constructor(targets, sources) {
    Object.assign(this, { targets, sources })
  }
}

export class ForLoop {
  constructor(iterator, range, body) {
    Object.assign(this, { iterator, range, body })
  }
}

export class WhileLoop {
  constructor(test, body) {
    Object.assign(this, { test, body })
  }
}

export class PrintStatement {
  constructor(argument) {
    this.argument = argument
  }
}

export class Break {}

export class ReturnStatement {
  constructor(returnValue) {
    this.returnValue = returnValue
  }
}

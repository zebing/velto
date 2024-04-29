import { NullLiteral, ObjectExpression, Identifier, variableDeclaration, variableDeclarator, callExpression, Statement, Expression, identifier } from "@babel/types";
import { NodePath } from "@babel/core";
import { HelperName } from "../constants";
import { State } from "../types";

export function createElementExpression(options: {
  kind?: "const" | "var" | "let";
  id?: Identifier,
  name: string;
  argument: (NullLiteral | ObjectExpression | Expression)[];
  rootPath: NodePath<Statement>;
  state: State;
}) {
  const {state } = options;
  return createExpression({
    ...options,
    callee: state.get(HelperName.createElement),
  });
}

export function createComponentInstanceExpression(options: {
  kind?: "const" | "var" | "let";
  id?: Identifier,
  name: string;
  argument: (NullLiteral | ObjectExpression | Expression)[];
  rootPath: NodePath<Statement>;
  state: State;
}) {
  const {state } = options;
  return createExpression({
    ...options,
    callee: state.get(HelperName.createComponentInstance),
  });
}

export function createTextExpression(options: {
  kind?: "const" | "var" | "let";
  id?: Identifier,
  name: string;
  argument: (NullLiteral | ObjectExpression | Expression)[];
  rootPath: NodePath<Statement>;
  state: State;
}) {
  const {state } = options;
  return createExpression({
    ...options,
    callee: state.get(HelperName.createText),
  });
}

export function createExpression(options: {
  kind?: "const" | "var" | "let";
  id?: Identifier,
  name: string;
  argument: (NullLiteral | ObjectExpression | Expression)[];
  rootPath: NodePath<Statement>;
  callee: Identifier,
}) {
  const {
    name,argument, rootPath, callee, kind = 'const',
    id = rootPath.scope.generateUidIdentifier(name),
  } = options;
  const el = variableDeclaration(
    kind,
    [
      variableDeclarator(
        id,
        callExpression(
          callee,
          argument,
        )
      )
    ]
  );
  
  rootPath?.insertBefore(el);
  return id;
}
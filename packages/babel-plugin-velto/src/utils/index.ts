import {
  JSXOpeningElement,
  Expression,
  expressionStatement,
  callExpression,
  Identifier,
  variableDeclaration,
  variableDeclarator,
} from "@babel/types";
import { NodePath } from "@babel/traverse";

export * from './getRenderList';

export function getTagLiteral(path: NodePath<JSXOpeningElement>) {
  const namePath = path.get("name");
  return namePath.getSource();
}

export function getExpressionStatement(
  callee: Expression,
  argumentList: Expression[] = [],
) {
  return expressionStatement(callExpression(callee, argumentList));
}

export function getVariableDeclaration(
  id: Identifier,
  callee: Expression,
  argumentList: Expression[] = [],
  kind: "var" | "let" | "const" = "const",
) {

  return variableDeclaration(
    kind, 
    [
      variableDeclarator(
        id, 
        callExpression(callee, argumentList)
      ),
    ]
  )
}
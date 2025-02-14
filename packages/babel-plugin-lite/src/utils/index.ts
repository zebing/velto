import { stringCurrying } from "./stringCurrying";
import { HTML_TAGS, SVG_TAGS } from "../constants";
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

export const isEvent = (key: string) => /^on[^a-z]/.test(key);
export const isHTMLTag = stringCurrying(HTML_TAGS, true);
export const isSVGTag = stringCurrying(SVG_TAGS, true);
export const isNativeTag = (name: string) => isHTMLTag(name) || isSVGTag(name);
export const isString = (value: any) =>
  Object.prototype.toString.call(value) === "[object String]";
export const isArray = (value: any) => Array.isArray(value);
export const isObject = (value: any) =>
  Object.prototype.toString.call(value) === "[object Object]";
export const isUndefined = (value: any) =>
  Object.prototype.toString.call(value) === "[object Undefined]";

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
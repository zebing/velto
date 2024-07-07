import { NodePath } from "@babel/traverse";
import { CallExpression, ArrowFunctionExpression, FunctionDeclaration, Identifier } from "@babel/types";
import { NodePathDataKey } from "../constants";

/**
 * list.map ref => list
 * @param path
 * @param key
 * @returns 
 */
export function getArrayMapCalleeNameRef<T = Node>(path: NodePath<T>, key: NodePathDataKey) {
  return path.data?.[key] as Identifier[] || [];
}

export function setArrayMapCalleeNameRef<
  T = Node,
  U = Identifier,
>(path: NodePath<T>, key: NodePathDataKey, value: U) {
  if (path) {
    if (!path.data) {
      path.data = {};
    }
  
    path.data[key] = value;
  }
}
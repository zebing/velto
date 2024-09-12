import { NodePath } from "@babel/traverse";
import { CallExpression, ArrowFunctionExpression, FunctionDeclaration, Identifier } from "@babel/types";
import { NodePathData } from "../types";

/**
 * list.map reactive => list
 * @param path
 * @param key
 * @returns 
 */
export function getArrayMapCalleeNameRef<T = Node>(path: NodePath<T>) {
  return (path.data as unknown as NodePathData)?.reactiveList as Identifier[] || [];
}

export function setArrayMapCalleeNameRef<
  T = Node,
>(path: NodePath<T>, value: Identifier[]) {
  if (path) {
    path.data ??= {};
    (path.data as unknown as NodePathData).reactiveList = value;
  }
}
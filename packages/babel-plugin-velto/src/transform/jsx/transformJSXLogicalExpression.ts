import { NodePath } from "@babel/core";
import { LogicalExpression, Expression, binaryExpression } from "@babel/types";
import { transformJSXConsequentExpression } from "./transformJSXConsequentExpression";

export function transformJSXLogicalExpression(
  path: NodePath<LogicalExpression>,
  test?: Expression
) {
  const left = path.get("left");
  const right = path.get("right");

  return transformJSXConsequentExpression(
    right,
    test ? binaryExpression("&", test, left.node) : left.node
  );
}

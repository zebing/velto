import { NodePath } from "@babel/core";
import {
  ConditionalExpression,
  unaryExpression,
  Expression,
  binaryExpression,
  CallExpression,
} from "@babel/types";
import { transformJSXConsequentExpression } from "./transformJSXConsequentExpression";

export function transformJSXConditionalExpression(
  path: NodePath<ConditionalExpression>,
  test?: Expression
): CallExpression[] {
  const subTest = path.get("test");
  const consequent = path.get("consequent");
  const alternate = path.get("alternate");

  return [
    ...transformJSXConsequentExpression(
      consequent,
      test ? binaryExpression("&", test, subTest.node) : subTest.node
    ),

    ...transformJSXConsequentExpression(
      alternate,
      test
        ? binaryExpression("&", test, unaryExpression("!", subTest.node))
        : unaryExpression("!", subTest.node)
    ),
  ];
}

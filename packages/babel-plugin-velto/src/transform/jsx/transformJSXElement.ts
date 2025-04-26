import {
  JSXElement,
  callExpression,
  stringLiteral,
  nullLiteral,
  objectExpression,
  arrayExpression,
  arrowFunctionExpression,
  Expression,
  identifier,
} from "@babel/types";
import { getTagLiteral } from "../../utils";
import { transformJSXChildren } from "./transformJSXChildren";
import { transformJSXComponentProps } from "./transformJSXComponentProps";
import { RuntimeHelper } from "../../helper";
import { NodePath } from "@babel/traverse";
import { isNativeTag } from "@velto/shared";

export function transformJSXElement(path: NodePath<JSXElement>) {
  const tag = getTagLiteral(path.get("openingElement"));
  const properties = transformJSXComponentProps(
    path.get("openingElement").get("attributes")
  );
  const children = transformJSXChildren(path.get("children"));
  const argumentList: Expression[] = [
    isNativeTag(tag) ? stringLiteral(tag) : identifier(tag),
    properties.length
      ? arrowFunctionExpression([], objectExpression(properties))
      : nullLiteral(),
  ];

  if (children.length) {
    argumentList.push(arrayExpression(children))
  }

  return callExpression(
    path.state.helper.getHelperNameIdentifier(RuntimeHelper.createElement),
    argumentList,
  );
}

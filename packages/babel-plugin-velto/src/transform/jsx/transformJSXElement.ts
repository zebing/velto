import {
  JSXElement,
  callExpression,
  stringLiteral,
  nullLiteral,
  objectExpression,
  arrayExpression,
} from "@babel/types";
import { getTagLiteral } from "../../utils";
import { transformJSXChildren } from "./transformJSXChildren";
import { transformJSXComponentProps } from "./transformJSXComponentProps";
import { RuntimeHelper } from "../../helper";
import { NodePath } from "@babel/traverse";

export function transformJSXElement(path: NodePath<JSXElement>) {
  const tag = getTagLiteral(path.get("openingElement"));
  const properties = transformJSXComponentProps(
    path.get("openingElement").get("attributes")
  );
  const children = transformJSXChildren(path.get("children"));

  return callExpression(
    path.state.helper.getHelperNameIdentifier(RuntimeHelper.createElement),
    [
      stringLiteral(tag),
      properties.length ? objectExpression(properties) : nullLiteral(),
      arrayExpression(children),
    ]
  );
}

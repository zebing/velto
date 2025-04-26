import {
  JSXFragment,
  arrowFunctionExpression,
  callExpression,
  arrayExpression,
  stringLiteral,
  nullLiteral,
  Expression,
} from "@babel/types";
import { transformJSXChildren } from "./transformJSXChildren";
import { RuntimeHelper } from "../../helper";
import { NodePath } from "@babel/traverse";

export function transformJSXFragment(path: NodePath<JSXFragment>) {
  const children = transformJSXChildren(path.get("children"));
  const argumentList: Expression[] = [];
  
  if (children.length) {
    argumentList.push(arrayExpression(children))
  }

  return callExpression(
    path.state.helper.getHelperNameIdentifier(RuntimeHelper.fragment),
    argumentList,
  );
}

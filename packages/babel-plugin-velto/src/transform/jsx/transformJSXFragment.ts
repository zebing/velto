import {
  JSXFragment,
  arrayExpression,
  callExpression,
  stringLiteral,
  nullLiteral,
} from "@babel/types";
import { transformJSXChildren } from "./transformJSXChildren";
import { RuntimeHelper } from "../../helper";
import { NodePath } from "@babel/traverse";

export function transformJSXFragment(path: NodePath<JSXFragment>) {
  const children = transformJSXChildren(path.get("children"));
  return callExpression(
    path.state.helper.getHelperNameIdentifier(RuntimeHelper.fragment),
    [nullLiteral(), arrayExpression(children)]
  );
}

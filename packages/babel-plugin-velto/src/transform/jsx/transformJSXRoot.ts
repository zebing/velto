import {
  callExpression,
  JSXElement,
  JSXFragment,
  arrowFunctionExpression,
  blockStatement,
  returnStatement,
} from "@babel/types";
import { transformJSXElement } from "./transformJSXElement";
import { transformJSXFragment } from "./transformJSXFragment";
import { NodePath } from "@babel/traverse";
import { RuntimeHelper } from "../../helper";

export function transformJSXRoot(path: NodePath<JSXElement | JSXFragment>) {
  const element = path.isJSXElement()
    ? transformJSXElement(path)
    : transformJSXFragment(path as NodePath<JSXFragment>);

  const root = callExpression(
    path.state.helper.getHelperNameIdentifier(RuntimeHelper.markRender),
    [
      arrowFunctionExpression(
        [],
        blockStatement([
          ...(path.state.helper.bodyStatement || []),
          returnStatement(element),
        ])
      ),
    ]
  );
  path.replaceWith(root);
}

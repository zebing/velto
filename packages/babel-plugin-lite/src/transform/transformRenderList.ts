import { NodePath } from "@babel/traverse";
import {
  JSXElement,
  isCallExpression,
  MemberExpression,
  Identifier,
  ArrowFunctionExpression,
  isBlockStatement,
  ReturnStatement,
  CallExpression,
  callExpression,
  identifier,
  JSXFragment,
} from "@babel/types";
import { HelperNameType } from "../helper";

export function transformRenderList(path: NodePath<JSXElement | JSXFragment>) {
  const functionParent = path.getFunctionParent();
  const body = functionParent?.get("body");
  const returnStatementNode =
    isBlockStatement(body?.node) && body.node.body[body.node.body.length - 1];
  const callee = (functionParent?.parentPath?.node as CallExpression)?.callee as MemberExpression;
  const isCallMap =
    isCallExpression(functionParent?.parentPath.node) &&
    (callee?.property as Identifier)?.name === "map";

  if (isCallMap && (
    // 1. list.map(() => { return <div></div> })
    // 2. list.map(function () { return <div></div> })
    (returnStatementNode as ReturnStatement)?.argument === path.node ||
    // list.map(() => <div></div>)
    functionParent?.node.body === path.node
  )) {
    const id = path.state.helper.getHelperNameIdentifier(HelperNameType.renderList);
    const renderListExpression = callExpression(
      id,
      [
        callee.object,
        functionParent.node as ArrowFunctionExpression,
      ]
    )
    functionParent.parentPath.replaceWith(renderListExpression);
  }
}

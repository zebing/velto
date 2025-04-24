import { Node, Identifier, ReturnStatement, isArrowFunctionExpression, isBlockStatement, isCallExpression, isFunctionExpression, isJSXElement, isJSXFragment, isMemberExpression, isReturnStatement, callExpression } from "@babel/types";
import { RuntimeHelper } from "../helper";
import { NodePath } from "@babel/traverse";

export function getRenderList(path: NodePath) {
  const express: Node = path.node;
  if (!isCallExpression(express)) return;
  const callee = express.callee;
  const [argument] = express.arguments;

  if (
    isMemberExpression(callee) &&
    (callee.property as Identifier)?.name === "map" &&
    (isArrowFunctionExpression(argument) || isFunctionExpression(argument))
  ) {
    const body = argument.body || {};
    let isJSX = isJSXElement(body) || isJSXFragment(body);

    if (isBlockStatement(body)) {
      const returnStatement = body.body.find((node) =>
        isReturnStatement(node)
      );
      const returnArgument = (returnStatement as ReturnStatement)?.argument;
      isJSX = isJSXElement(returnArgument) || isJSXFragment(returnArgument);
    }

    if (isJSX) {
      const [
        element = path.scope.generateUidIdentifier("element"),
        index = path.scope.generateUidIdentifier("index"),
        array = path.scope.generateUidIdentifier("array"),
      ] = argument.params;
      argument.params = [element, index, array];
      return callExpression(
        path.state.helper.getHelperNameIdentifier(
          RuntimeHelper.renderList
        ),
        [callee.object, argument]
      );
    }
  }
}
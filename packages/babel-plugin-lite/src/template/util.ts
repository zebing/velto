import { Node, CallExpression, Expression, Identifier, MemberExpression, ReturnStatement, isArrowFunctionExpression, isBlockStatement, isCallExpression, isFunctionExpression, isJSXElement, isJSXFragment, isMemberExpression, isReturnStatement, memberExpression, variableDeclarator, callExpression, variableDeclaration } from "@babel/types";
import { getExpressionStatement } from "../utils";
import { updateIdentifier } from "../constants";
import { RuntimeHelper } from "../helper";
import { NodePath } from "@babel/traverse";

export function getExpressionUpdateStatement(
  id: Identifier,
  test: Expression | undefined,
  express: Expression,
  renderListId: Identifier | undefined
) {
  const updateArgs = test
    ? renderListId
      ? [test, ((express as CallExpression).callee as MemberExpression).object]
      : [test, express]
    : renderListId
      ? [((express as CallExpression).callee as MemberExpression).object]
      : [express];

  return getExpressionStatement(
    memberExpression(id, updateIdentifier),
    updateArgs
  );
}

export function getRenderList(express: Node, rootPath: NodePath) {
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
        element = rootPath.scope.generateUidIdentifier("element"),
        index = rootPath.scope.generateUidIdentifier("index"),
        array = rootPath.scope.generateUidIdentifier("array"),
      ] = argument.params;
      argument.params = [element, index, array];
      return callExpression(
        rootPath.state.helper.getHelperNameIdentifier(
          RuntimeHelper.renderList
        ),
        [callee.object, argument]
      );
    }
  }
}
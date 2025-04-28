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

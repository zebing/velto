import { callExpression, Expression, arrowFunctionExpression } from "@babel/types";
import { RuntimeHelper } from "../../helper";
import { NodePath } from "@babel/traverse";
import { getRenderList } from "../../utils";

export function transformJSXExpression(path: NodePath<Expression>) {
  const renderList = getRenderList(path);

  if (renderList) {
    return renderList;
  }

  return callExpression(
    path.state.helper.getHelperNameIdentifier(RuntimeHelper.expression),
    [arrowFunctionExpression([], path.node as Expression)]
  );
}

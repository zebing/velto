import { Identifier, JSXExpressionContainer, JSXSpreadChild, Expression, variableDeclaration, variableDeclarator, callExpression } from '@babel/types';
import { TransformJSXOptions } from '../types';
import { getRenderList } from "../utils/getRenderList";
import { RuntimeHelper } from '../helper';

export function transformJSXExpression({
  path, context,
}: TransformJSXOptions<JSXExpressionContainer | JSXSpreadChild>) {
  const expression = path.get('expression');
  const renderListExpression = getRenderList(expression.node as Expression, expression);

  context.indent();
  context.newline();
  let id = expression.node  as Identifier;
  if (renderListExpression) {
    id = path.state.helper.rootPath.scope.generateUidIdentifier("renderList");
    context.pushHoistExpressions(
      variableDeclaration("const", [
        variableDeclarator(id, renderListExpression),
      ])
    )
  }

  context.pushExpression(
    callExpression(
      path.state.helper.getHelperNameIdentifier(RuntimeHelper.ssrExpression),
      [id],
    ),
  );

  context.deindent();
}

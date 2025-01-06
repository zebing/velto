import { JSXExpressionContainer, JSXSpreadChild, Expression } from '@babel/types';
import { TransformJSXOptions } from '../../types';
import { getParentId } from '../parentId';

export function transformJSXExpression({
  path, render,
}: TransformJSXOptions<JSXExpressionContainer | JSXSpreadChild>) {
  const expression = path.get('expression');
  const parentId = getParentId(expression);

  render.expression({
    target: parentId,
    express: expression.node as Expression,
  });
}

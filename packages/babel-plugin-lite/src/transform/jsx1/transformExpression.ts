import { NodePath } from '@babel/traverse';
import { JSXElement, JSXFragment, JSXExpressionContainer, JSXSpreadChild, JSXText, identifier, Expression, stringLiteral, Identifier } from '@babel/types';
import transformJSXElement from './transformJSXElement';
import transformChildren from './transformChildren';
import transformJSXElementAttribute from './transformJSXElementAttribute';
import { getTagLiteral, getReactives } from '../../utils';
import Render from '../../render';

export default function transformExpression(
  path: NodePath<JSXExpressionContainer | JSXSpreadChild>,
  render: Render,
) {
  const expression = path.get('expression');
  const reactiveList = getReactives(path);
  const parentId = getParentId(expression);

  render.expression({
    target: parentId,
    express: expression.node as Expression,
    reactiveList,
  });
}

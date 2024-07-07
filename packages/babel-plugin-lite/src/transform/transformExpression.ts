import { NodePath } from '@babel/traverse';
import { JSXElement, JSXFragment, JSXExpressionContainer, JSXSpreadChild, JSXText, identifier, Expression, stringLiteral, Identifier } from '@babel/types';
import { State } from '../types';
import { StateName, anchorIdentifier } from '../constants';
import transformJSXElement from './transformJSXElement';
import transformChildren from './transformChildren';
import transformJSXElementAttribute from './transformJSXElementAttribute';
import { getTagLiteral, getParentId, setParentId, getRefs } from '../utils';
import Render from '../render';

export default function transformExpression(
  path: NodePath<JSXExpressionContainer | JSXSpreadChild>,
  state: State,
  render: Render,
) {
  const expression = path.get('expression');
  const refList = getRefs(path);
  const parentId = getParentId(expression);

  render.expression({
    target: parentId,
    express: expression.node as Expression,
    refList,
  });
}

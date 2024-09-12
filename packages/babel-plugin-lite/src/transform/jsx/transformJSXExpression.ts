import { NodePath } from '@babel/traverse';
import { JSXElement, JSXFragment, JSXExpressionContainer, JSXSpreadChild, JSXText, identifier, Expression, stringLiteral, Identifier } from '@babel/types';
import transformJSXElement from './transformJSXElement';
import transformJSXElementAttribute from './transformJSXElementAttribute';
import { getTagLiteral, getReactives } from '../../utils';
import Render from '../../render';
import { TransformJSXOptions } from '../../types';
import { getParentId } from '../parentId';

export default function transformJSXExpression({
  path, render,
}: TransformJSXOptions<JSXExpressionContainer | JSXSpreadChild>) {
  const expression = path.get('expression');
  const reactiveList = getReactives(path);
  const parentId = getParentId(expression);

  // render.expression({
  //   target: parentId,
  //   express: expression.node as Expression,
  //   reactiveList,
  // });
}

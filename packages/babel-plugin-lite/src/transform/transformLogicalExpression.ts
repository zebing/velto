import { NodePath } from '@babel/core';
import { LogicalExpression, ExpressionStatement, expressionStatement, CallExpression, ifStatement, blockStatement, isExpressionStatement, isIfStatement, IfStatement } from '@babel/types';
import { State } from '../types';
import transformChildren from './transformChildren';
import transformJSXElement from './transformJSXElement';
import transformJSXToBlockStatement from './transformJSXToBlockStatement';

export default function transformLogicalExpression(path: NodePath<LogicalExpression>, state: State) {
  const left = path.get('left');
  const right = path.get('right');

  return [
    ifStatement(
      left.node,
      transformJSXToBlockStatement(right, state),
    )
  ];
}
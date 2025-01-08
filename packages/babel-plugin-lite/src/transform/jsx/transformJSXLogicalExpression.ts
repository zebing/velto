import { NodePath } from '@babel/core';
import { LogicalExpression, Expression, binaryExpression } from '@babel/types';
import { transformJSXConsequentExpression } from './transformJSXConsequentExpression';
import Render from '../../render';

export function transformJSXLogicalExpression({ path, render, test }: {
  path: NodePath<LogicalExpression>;
  render: Render;
  test?: Expression;
}) {
  const left = path.get('left');
  const right = path.get('right');

  transformJSXConsequentExpression({
    test: test ? binaryExpression('&', test, left.node) : left.node, 
    consequent: right, 
    render,
  });
}
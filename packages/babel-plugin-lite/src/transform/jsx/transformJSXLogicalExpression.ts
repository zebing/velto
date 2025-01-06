import { NodePath } from '@babel/core';
import { LogicalExpression } from '@babel/types';
import { transformJSXConsequentExpression } from './transformJSXConsequentExpression';
import Render from '../../render';

export function transformJSXLogicalExpression({ path, render }: {
  path: NodePath<LogicalExpression>, 
  render: Render,
}) {
  const left = path.get('left');
  const right = path.get('right');

  transformJSXConsequentExpression({
    test: left.node, 
    consequent: right, 
    render,
  });
}
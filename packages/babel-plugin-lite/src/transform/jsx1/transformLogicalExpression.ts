import { NodePath } from '@babel/core';
import { LogicalExpression } from '@babel/types';
import transformConsequentExpression from './transformConsequentExpression';
import Render from '../../render';
import { getReactives } from '../../utils';

export default function transformLogicalExpression(
  path: NodePath<LogicalExpression>, 
  render: Render,
) {
  const left = path.get('left');
  const right = path.get('right');

  transformConsequentExpression({
    test: left.node, 
    testRefList: getReactives(left),
    consequent: right, 
    render,
  });
}
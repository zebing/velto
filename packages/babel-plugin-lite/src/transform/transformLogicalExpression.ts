import { NodePath } from '@babel/core';
import { LogicalExpression } from '@babel/types';
import { State } from '../types';
import transformConsequentExpression from './transformConsequentExpression';
import Render from '../render';
import { getRefs } from '../utils';

export default function transformLogicalExpression(
  path: NodePath<LogicalExpression>, 
  state: State,
  render: Render,
) {
  const left = path.get('left');
  const right = path.get('right');

  transformConsequentExpression({
    test: left.node, 
    testRefList: getRefs(left),
    consequent: right, 
    state, 
    render,
  });
}
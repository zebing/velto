import { NodePath } from '@babel/core';
import { ConditionalExpression, unaryExpression, callExpression, arrowFunctionExpression, blockStatement } from '@babel/types';
import { State } from '../types';
import transformConsequentExpression from './transformConsequentExpression';
import Render from '../render';
import { getParentId, getRefs } from '../utils';

export default function transformConditionalExpression(
  path: NodePath<ConditionalExpression>, 
  state: State,
  render: Render,
) {
  const test = path.get('test');
  const consequent = path.get('consequent');
  const alternate = path.get('alternate');
  const testRefList = getRefs(test);

  transformConsequentExpression({
    test: test.node, 
    testRefList,
    consequent: consequent, 
    state, 
    render,
  });

  transformConsequentExpression({
    test: unaryExpression('!', test.node), 
    testRefList,
    consequent: alternate, 
    state, 
    render,
  });
}
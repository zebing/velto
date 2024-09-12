import { NodePath } from '@babel/core';
import { ConditionalExpression, unaryExpression, callExpression, arrowFunctionExpression, blockStatement } from '@babel/types';
import transformConsequentExpression from './transformConsequentExpression';
import Render from '../../render';
import { getParentId, getReactives } from '../../utils';

export default function transformConditionalExpression(
  path: NodePath<ConditionalExpression>, 
  render: Render,
) {
  const test = path.get('test');
  const consequent = path.get('consequent');
  const alternate = path.get('alternate');
  const testRefList = getReactives(test);

  transformConsequentExpression({
    test: test.node, 
    testRefList,
    consequent: consequent, 
    render,
  });

  transformConsequentExpression({
    test: unaryExpression('!', test.node), 
    testRefList,
    consequent: alternate, 
    render,
  });
}
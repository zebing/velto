import { NodePath } from '@babel/core';
import { ConditionalExpression, unaryExpression, callExpression, arrowFunctionExpression, blockStatement } from '@babel/types';
import { transformJSXConsequentExpression } from './transformJSXConsequentExpression';
import Render from '../../render';
import { getReactives } from '../../utils';

export function transformJSXConditionalExpression({ path, render }: { path: NodePath<ConditionalExpression>, 
  render: Render }) {
  const test = path.get('test');
  const consequent = path.get('consequent');
  const alternate = path.get('alternate');
  const testRefList = getReactives(test);

  transformJSXConsequentExpression({
    test: test.node, 
    testRefList,
    consequent: consequent, 
    render,
  });

  transformJSXConsequentExpression({
    test: unaryExpression('!', test.node), 
    testRefList,
    consequent: alternate, 
    render,
  });
}
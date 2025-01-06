import { NodePath } from '@babel/core';
import { ConditionalExpression, unaryExpression, callExpression, arrowFunctionExpression, blockStatement } from '@babel/types';
import { transformJSXConsequentExpression } from './transformJSXConsequentExpression';
import Render from '../../render';

export function transformJSXConditionalExpression({ path, render }: { path: NodePath<ConditionalExpression>, 
  render: Render }) {
  const test = path.get('test');
  const consequent = path.get('consequent');
  const alternate = path.get('alternate');

  transformJSXConsequentExpression({
    test: test.node, 
    consequent: consequent, 
    render,
  });

  transformJSXConsequentExpression({
    test: unaryExpression('!', test.node), 
    consequent: alternate, 
    render,
  });
}
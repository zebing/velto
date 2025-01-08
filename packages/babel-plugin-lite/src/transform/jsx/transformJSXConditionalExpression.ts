import { NodePath } from '@babel/core';
import { ConditionalExpression, unaryExpression, Expression, logicalExpression, binaryExpression } from '@babel/types';
import { transformJSXConsequentExpression } from './transformJSXConsequentExpression';
import Render from '../../render';

export function transformJSXConditionalExpression({ path, render, test }: {
  path: NodePath<ConditionalExpression>;
  render: Render;
  test?: Expression;
}) {
  const subTest = path.get('test');
  const consequent = path.get('consequent');
  const alternate = path.get('alternate');

  transformJSXConsequentExpression({
    test: test ? binaryExpression('&', test, subTest.node) : subTest.node, 
    consequent, 
    render,
  });

  transformJSXConsequentExpression({
    test: test ? binaryExpression('&', test, unaryExpression('!', subTest.node)) : unaryExpression('!', subTest.node), 
    consequent: alternate, 
    render,
  });
}
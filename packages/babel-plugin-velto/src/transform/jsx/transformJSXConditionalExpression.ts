import { NodePath } from '@babel/core';
import { ConditionalExpression, unaryExpression, Expression, binaryExpression } from '@babel/types';
import { transformJSXConsequentExpression } from './transformJSXConsequentExpression';
import Template from '../../template';

export function transformJSXConditionalExpression({ path, template, test }: {
  path: NodePath<ConditionalExpression>;
  template: Template;
  test?: Expression;
}) {
  const subTest = path.get('test');
  const consequent = path.get('consequent');
  const alternate = path.get('alternate');

  transformJSXConsequentExpression({
    test: test ? binaryExpression('&', test, subTest.node) : subTest.node, 
    consequent, 
    template,
  });

  transformJSXConsequentExpression({
    test: test ? binaryExpression('&', test, unaryExpression('!', subTest.node)) : unaryExpression('!', subTest.node), 
    consequent: alternate, 
    template,
  });
}
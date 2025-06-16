import { NodePath } from '@babel/core';
import { ConditionalExpression, unaryExpression, Expression, binaryExpression } from '@babel/types';
import { transformJSXConsequentExpression } from './transformJSXConsequentExpression';
import TemplateLiteralContext from '../TemplateLiteralContext';

export function transformJSXConditionalExpression({ path, test, context }: {
  path: NodePath<ConditionalExpression>;
  test?: Expression;
  context: TemplateLiteralContext;
}) {
  const subTest = path.get('test');
  const consequent = path.get('consequent');
  const alternate = path.get('alternate');

  transformJSXConsequentExpression({
    test: test ? binaryExpression('&', test, subTest.node) : subTest.node, 
    consequent, 
    context,
  });

  transformJSXConsequentExpression({
    test: test ? binaryExpression('&', test, unaryExpression('!', subTest.node)) : unaryExpression('!', subTest.node), 
    consequent: alternate, 
    context,
  });
}
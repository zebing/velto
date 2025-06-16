import { NodePath } from '@babel/core';
import { Identifier, MemberExpression, LogicalExpression, Expression, binaryExpression } from '@babel/types';
import { transformJSXConsequentExpression } from './transformJSXConsequentExpression';
import TemplateLiteralContext from '../TemplateLiteralContext';

export function transformJSXLogicalExpression({ path, test, context }: {
  path: NodePath<LogicalExpression>;
  test?: Expression;
  context: TemplateLiteralContext;
}) {
  const left = path.get('left');
  const right = path.get('right');

  transformJSXConsequentExpression({
    test: test ? binaryExpression('&', test, left.node) : left.node, 
    consequent: right, 
    context,
  });
}
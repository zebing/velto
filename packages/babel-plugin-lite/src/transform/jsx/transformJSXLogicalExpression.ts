import { NodePath } from '@babel/core';
import { LogicalExpression, Expression, binaryExpression } from '@babel/types';
import { transformJSXConsequentExpression } from './transformJSXConsequentExpression';
import Template from '../../template';

export function transformJSXLogicalExpression({ path, template, test }: {
  path: NodePath<LogicalExpression>;
  template: Template;
  test?: Expression;
}) {
  const left = path.get('left');
  const right = path.get('right');

  transformJSXConsequentExpression({
    test: test ? binaryExpression('&', test, left.node) : left.node, 
    consequent: right, 
    template,
  });
}
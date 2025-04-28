import { NodePath } from '@babel/core';
import { Identifier, MemberExpression, LogicalExpression, Expression, binaryExpression } from '@babel/types';
import { transformJSXConsequentExpression } from './transformJSXConsequentExpression';
import Template from '../../template';

export function transformJSXLogicalExpression({ path, template, test, target, anchor }: {
  path: NodePath<LogicalExpression>;
  template: Template;
  test?: Expression;
  target: Identifier | MemberExpression;
  anchor?: Identifier;
}) {
  const left = path.get('left');
  const right = path.get('right');

  transformJSXConsequentExpression({
    test: test ? binaryExpression('&', test, left.node) : left.node, 
    consequent: right, 
    template,
    target,
    anchor,
  });
}
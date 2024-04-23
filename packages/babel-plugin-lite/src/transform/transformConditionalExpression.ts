import { NodePath } from '@babel/core';
import { ConditionalExpression, ifStatement } from '@babel/types';
import { State } from '../types';
import transformJSXToBlockStatement from './transformJSXToBlockStatement';

export default function transformConditionalExpression(path: NodePath<ConditionalExpression>, state: State) {
  const test = path.get('test');
  const consequent = path.get('consequent');
  const alternate = path.get('alternate');

  return [
    ifStatement(
      test.node,
      transformJSXToBlockStatement(consequent, state),
      transformJSXToBlockStatement(alternate, state),
    )
  ];
}
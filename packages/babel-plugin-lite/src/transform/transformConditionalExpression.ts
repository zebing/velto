import { NodePath } from '@babel/core';
import { ConditionalExpression, ifStatement, callExpression, arrowFunctionExpression, blockStatement } from '@babel/types';
import { State } from '../types';
import transformJSXToBlockStatement from './transformJSXToBlockStatement';
import Render from '../render';

export default function transformConditionalExpression(
  path: NodePath<ConditionalExpression>, 
  state: State,
  render: Render,
) {
  // const test = path.get('test');
  // const consequent = path.get('consequent');
  // const alternate = path.get('alternate');

  // return [
  //   callExpression(
  //     state.get(HelperName.effect),
  //     [
  //       arrowFunctionExpression(
  //         [], blockStatement([
  //           ifStatement(
  //             test.node,
  //             transformJSXToBlockStatement(consequent, state),
  //             transformJSXToBlockStatement(alternate, state),
  //           )
  //       ]))
  //     ],
  //   )
  // ];
}
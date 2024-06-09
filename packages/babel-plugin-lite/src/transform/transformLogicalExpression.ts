import { NodePath } from '@babel/core';
import { LogicalExpression, callExpression, expressionStatement, CallExpression, ifStatement, blockStatement, isExpressionStatement, isIfStatement, stringLiteral, arrowFunctionExpression } from '@babel/types';
import { State } from '../types';
import transformChildren from './transformChildren';
import transformJSXElement from './transformJSXElement';
import transformJSXToBlockStatement from './transformJSXToBlockStatement';
import { StateName } from '../constants';
import Render from '../render';

export default function transformLogicalExpression(
  path: NodePath<LogicalExpression>, 
  state: State,
  render: Render,
) {
  // const left = path.get('left');
  // const right = path.get('right');
  // const jsxRootPath = state.get(StateName.jsxRootPath);
  // const place = createTextExpression({
  //   kind: 'const',
  //   name: 'place',
  //   argument: [stringLiteral(' ')],
  //   rootPath: jsxRootPath,
  //   state,
  // });

  // return [
  //   callExpression(
  //     state.get(HelperName.effect),
  //     [
  //       arrowFunctionExpression(
  //         [], blockStatement([
  //           ifStatement(
  //             left.node,
  //             transformJSXToBlockStatement(right, state),
  //           )
  //       ]))
  //     ],
  //   )
  // ];
}
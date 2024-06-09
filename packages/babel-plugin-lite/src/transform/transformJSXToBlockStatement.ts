import { NodePath } from '@babel/core';
import { Expression,  blockStatement, CallExpression, ExpressionStatement, IfStatement, isExpressionStatement, isIfStatement, expressionStatement } from '@babel/types';
import { State } from '../types';
import transformChildren from './transformChildren';
import transformJSXElement from './transformJSXElement';
import Render from '../render';

export default function getBlockStatementFromJSX(
  path: NodePath<Expression>, 
  state: State,
  render: Render,
) {
  // let list: (CallExpression | ExpressionStatement | IfStatement)[] = [];

  // if (path.isJSXElement()) {
  //   list = transformJSXElement(path, state);
  // } else if (path.isJSXFragment()) {
  //   list = transformChildren(path.get('children'), state);
  // } else {
  //   list = [expressionStatement(path.node)];
  // }

  // const statementBody = list.map((node) => {
  //   if (isExpressionStatement(node) || isIfStatement(node)) {
  //     return node;
  //   }
  //   return expressionStatement(node);
  // });

  // return blockStatement(statementBody);
}
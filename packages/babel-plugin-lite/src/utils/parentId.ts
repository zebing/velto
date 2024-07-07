import { NodePath } from '@babel/core';
import { JSXEmptyExpression, Expression, SpreadElement, JSXText, JSXSpreadChild, Identifier, ExpressionStatement, BlockStatement, Statement, JSXAttribute, JSXSpreadAttribute, JSXExpressionContainer } from '@babel/types';
import { targetIdentifier, NodePathDataKey } from '../constants';

export function getParentId(path: NodePath<JSXEmptyExpression | JSXSpreadChild | JSXText | Expression | SpreadElement | JSXAttribute | JSXSpreadAttribute | JSXExpressionContainer>) {
  let parent = path.parentPath;
  while(parent) {
    if (parent?.data?.[NodePathDataKey.parentId]) {
      return parent.data?.[NodePathDataKey.parentId] as Identifier;
    }

    if (parent.parentPath) {
      parent = parent.parentPath;
    } else {
      return targetIdentifier;
    }
  }
  return targetIdentifier;
}

export function setParentId(path: NodePath<JSXText | Expression | SpreadElement | ExpressionStatement | BlockStatement | Statement>, id: Identifier = targetIdentifier) {
  if (path) {
    if (!path.data) {
      path.data = {};
    }
  
    path.data[NodePathDataKey.parentId] = id;
  }
}

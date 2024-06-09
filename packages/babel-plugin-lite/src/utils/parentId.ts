import { NodePath } from '@babel/core';
import { JSXEmptyExpression, Expression, SpreadElement, JSXText, JSXSpreadChild, Identifier, ExpressionStatement, BlockStatement, Statement, JSXAttribute, JSXSpreadAttribute, JSXExpressionContainer } from '@babel/types';
import { targetIdentifier } from '../constants';

export function getParentId(path: NodePath<JSXEmptyExpression | JSXSpreadChild | JSXText | Expression | SpreadElement | JSXAttribute | JSXSpreadAttribute | JSXExpressionContainer>) {
  let parent = path.parentPath;
  while(parent) {
    if (parent?.state?.parentId) {
      return parent.state.parentId;
    }

    if (parent.parentPath) {
      parent = parent.parentPath;
    } else {
      return targetIdentifier;
    }
  }
}

export function setParentId(path?: NodePath<JSXText | Expression | SpreadElement | ExpressionStatement | BlockStatement | Statement>, id: Identifier = targetIdentifier) {
  if (path) {
    if (!path.state) {
      path.state = {};
    }
  
    path.state.parentId = id;
  }
}
import { NodePath } from '@babel/core';
import { Expression, SpreadElement, JSXText, identifier, Identifier, ExpressionStatement, BlockStatement, Statement } from '@babel/types';
import { RenderFunctionParamsName } from './';

export function getParentId(path: NodePath<JSXText | Expression | SpreadElement>) {
  let parent = path.parentPath;
  while(parent) {
    if (parent?.state?.parentId) {
      return parent.state.parentId;
    }

    if (parent.parentPath) {
      parent = parent.parentPath;
    } else {
      return identifier(RenderFunctionParamsName.container);
    }
  }
}

export function setParentId(path?: NodePath<JSXText | Expression | SpreadElement | ExpressionStatement | BlockStatement | Statement>, id: Identifier = identifier(RenderFunctionParamsName.container)) {
  if (path) {
    if (!path.state) {
      path.state = {};
    }
  
    path.state.parentId = id;
  }
}
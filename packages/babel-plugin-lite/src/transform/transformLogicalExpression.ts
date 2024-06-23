import { NodePath } from '@babel/core';
import { LogicalExpression, callExpression, expressionStatement, CallExpression, ifStatement, blockStatement, isExpressionStatement, isIfStatement, stringLiteral, arrowFunctionExpression } from '@babel/types';
import { State } from '../types';
import transformChildren from './transformChildren';
import transformJSXElement from './transformJSXElement';
import transformJSXRoot from './transformJSXRoot';
import { StateName } from '../constants';
import Render, { CallExpressionName } from '../render';
import { getParentId, getRefs } from '../utils';

export default function transformLogicalExpression(
  path: NodePath<LogicalExpression>, 
  state: State,
  render: Render,
) {
  const left = path.get('left');
  const right = path.get('right');
  const target = getParentId(path);
  const spaceAnchor = render.space(target);

  if (right.isJSXElement() || right.isJSXFragment()) {
    const subRender = new Render({
      nodePath: right,
      state,
    });
    
    transformJSXRoot(right, state, subRender);
    const renderFunctionDeclaration = render.hoist(
      subRender.generateFunctionDeclaration()
    );

    const refList = getRefs(left);

    render.expression({
      express: renderFunctionDeclaration,
      target,
      anchor: spaceAnchor,
      refList,
      test: left.node,
    });
  } else {
    const refList = getRefs(path);
    render.expression({
      express: right.node,
      target,
      anchor: spaceAnchor,
      refList,
      test: left.node,
    });
  }
}
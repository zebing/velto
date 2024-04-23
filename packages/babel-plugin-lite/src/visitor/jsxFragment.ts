import { NodePath } from '@babel/core';
import { JSXFragment } from '@babel/types';
import { State } from '../types';
import { StateName } from '../constants';
import { transformChildren } from '../transform';
import { renderFunction } from '../helper';

export default function JSXFragment(path: NodePath<JSXFragment>, state: State) {
  state.set(StateName.hasJSX, true);
  state.set(StateName.jsxRootPath, path.getStatementParent());
  const children = transformChildren(path.get('children'), state);
  path.replaceWith(renderFunction({ children, path }));
}
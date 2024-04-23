import { NodePath } from '@babel/core';
import { JSXElement } from '@babel/types';
import { transformJSXElement } from '../transform';
import { State } from '../types';
import { StateName } from '../constants';
import { renderFunction } from '../helper';

export default function JSXElement(path: NodePath<JSXElement>, state: State) {
  state.set(StateName.hasJSX, true);
  state.set(StateName.jsxRootPath, path.getStatementParent());

  const nodeList = transformJSXElement(path, state);
  path.replaceWith(renderFunction({ children: nodeList, path }));
}

import { NodePath,  } from '@babel/traverse';
import { JSXFragment } from '@babel/types';
import { State } from '../types';
import { StateName } from '../constants';
import Render from '../render';
import transformJSXRoot from '../transform/transformJSXRoot';

export default function JSXFragment(path: NodePath<JSXFragment>, state: State) {
  state.set(StateName.jsxRootPath, path.getStatementParent());
  const render = new Render({
    nodePath: path,
    state,
  });
  transformJSXRoot(path, state, render);
  
  path.replaceWith(render.generateFunctionDeclaration());
}
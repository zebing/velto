import { NodePath } from '@babel/traverse';
import { JSXElement } from '@babel/types';
import { State } from '../types';
import { StateName } from '../constants';
import transformJSXRoot from '../transform/transformJSXRoot';
import Render from '../render';

export default function JSXElement(path: NodePath<JSXElement>, state: State) {
  state.set(StateName.jsxRootPath, path.getStatementParent());
  const render = new Render({
    nodePath: path,
    state,
  });
  transformJSXRoot(path, state, render);
  const id = render.hoist(
    render.generateFunctionDeclaration()
  );
  
  path.replaceWith(id);
}

import { NodePath,  } from '@babel/traverse';
import { JSXFragment } from '@babel/types';
import Render from '../render';
import { transformJSX } from '../transform';

export default function JSXFragment(path: NodePath<JSXFragment>) {
  const render = new Render({
    rootPath: path,
  });
  transformJSX({ path, render, root: true });
  
  path.replaceWith(render.generate());
}
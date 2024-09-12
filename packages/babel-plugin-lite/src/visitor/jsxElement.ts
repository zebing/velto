import { NodePath } from '@babel/traverse';
import { JSXElement } from '@babel/types';
import { transformJSX } from '../transform';
import Render from '../render';

export default function JSXElement(path: NodePath<JSXElement>) {
  const render = new Render({
    rootPath: path,
  });
  transformJSX({ path, render, root: true });
  path.replaceWith(render.generate());
}

import { NodePath,  } from '@babel/traverse';
import { JSXFragment } from '@babel/types';
import Template from '../template';
import { transformJSX } from '../transform';

export default function JSXFragment(path: NodePath<JSXFragment>) {
  const template = new Template({
    rootPath: path,
  });
  transformJSX({ path, template, root: true });
  template.replace();
}
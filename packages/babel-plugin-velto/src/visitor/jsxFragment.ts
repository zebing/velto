import { NodePath,  } from '@babel/traverse';
import { JSXFragment } from '@babel/types';
import { transformJSXRoot } from '../transform';

export default function JSXFragment(path: NodePath<JSXFragment>) {
  transformJSXRoot(path);
}
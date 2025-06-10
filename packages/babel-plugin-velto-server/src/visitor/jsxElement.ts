import { NodePath } from "@babel/traverse";
import { JSXElement } from "@babel/types";
import JSXRoot from '../transform';

export default function JSXElement(path: NodePath<JSXElement>) {
  JSXRoot(path);
}

import { NodePath } from "@babel/traverse";
import { JSXFragment } from "@babel/types";
import JSXRoot from "../transform";

export default function JSXFragment(path: NodePath<JSXFragment>) {
  path.replaceWith(JSXRoot(path));
}

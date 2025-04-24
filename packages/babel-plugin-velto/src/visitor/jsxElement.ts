import { NodePath } from "@babel/traverse";
import { JSXElement } from "@babel/types";
import { transformJSXRoot } from "../transform";

export default function JSXElement(path: NodePath<JSXElement>) {
  transformJSXRoot(path);
}

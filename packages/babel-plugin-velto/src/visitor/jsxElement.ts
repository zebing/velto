import { NodePath } from "@babel/traverse";
import { JSXElement } from "@babel/types";
import { transformJSX } from "../transform";
import Template from "../template";

export default function JSXElement(path: NodePath<JSXElement>) {
  const template = new Template({
    rootPath: path,
  });
  transformJSX({ path, template, root: true });
  template.replace();
}

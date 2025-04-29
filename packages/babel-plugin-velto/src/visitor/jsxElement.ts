import { NodePath } from "@babel/traverse";
import { JSXElement } from "@babel/types";
import { transformJSXElement } from "../transform";
import Template from "../template";
import { targetIdentifier, anchorIdentifier } from "../constants";

export default function JSXElement(path: NodePath<JSXElement>) {
  const template = new Template(path.state.helper);
  transformJSXElement({
    path,
    template,
    target: targetIdentifier,
    anchor: anchorIdentifier,
  });
  path.replaceWith(template.generate());
}

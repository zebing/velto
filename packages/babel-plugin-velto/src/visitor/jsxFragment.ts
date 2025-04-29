import { NodePath } from "@babel/traverse";
import { JSXFragment } from "@babel/types";
import Template from "../template";
import { transformJSXFragment } from "../transform";
import { targetIdentifier, anchorIdentifier } from "../constants";

export default function JSXFragment(path: NodePath<JSXFragment>) {
  const template = new Template(path.state.helper);
  transformJSXFragment({
    path,
    template,
    target: targetIdentifier,
    anchor: anchorIdentifier,
  });
  path.replaceWith(template.generate());
}

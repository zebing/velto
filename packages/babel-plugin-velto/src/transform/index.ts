import { NodePath } from "@babel/traverse";
import { JSXElement, JSXFragment } from "@babel/types";
import { transformJSXElement } from "./transformJSXElement";
import { transformJSXFragment } from './transformJSXFragment'
import Template from "../template";
import { targetIdentifier, anchorIdentifier } from "../constants";

export default function JSXRoot(path: NodePath<JSXElement | JSXFragment>) {
  const template = new Template(path.state.helper);

  if (path.isJSXFragment()) {
    transformJSXFragment({
      path,
      template,
      target: targetIdentifier,
      anchor: anchorIdentifier,
    });
  } else {
    transformJSXElement({
      path: path as NodePath<JSXElement>,
      template,
      target: targetIdentifier,
      anchor: anchorIdentifier,
    });
  }
  
  path.replaceWith(template.generate());
}

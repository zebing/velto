import { NodePath } from "@babel/traverse";
import { JSXElement, JSXFragment } from "@babel/types";
import { transformJSXElement } from "./transformJSXElement";
import { transformJSXFragment } from './transformJSXFragment'
import Template from "../template";
import { targetIdentifier, anchorIdentifier } from "../constants";
import { isArray } from "@velto/shared";
import { transformJSXChildren } from "./transformJSXChildren";

export default function JSXRoot(path: NodePath<JSXElement | JSXFragment> | NodePath[]) {
  const pahtState = isArray(path) ? path[0].state : path.state;
  const template = new Template(pahtState.helper);
  const commonOptions = {
    template,
    target: targetIdentifier,
    anchor: anchorIdentifier,
  };

  if (isArray(path)) {
    transformJSXChildren({
      ...commonOptions,
      path,
    });
  } else if (path.isJSXFragment()) {
    transformJSXFragment({
      ...commonOptions,
      path,
    });
  } else {
    transformJSXElement({
      ...commonOptions,
      path: path as NodePath<JSXElement>,
    });
  }
  
  return template.generate();
}

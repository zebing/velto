import {
  JSXElement,
  objectProperty,
  identifier,
  memberExpression,
} from "@babel/types";
import { isNativeTag } from "@velto/shared";
import { getTagLiteral } from "../utils";
import { transformJSXChildren } from "./transformJSXChildren";
import { transformJSXComponentProps } from "./transformJSXComponentProps";
import { anchorIdentifier, targetIdentifier } from "../constants";
import { TransformJSXOptions } from "../types";
import JSXRoot from "./";

export function transformJSXElement({
  path,
  template,
  target,
  anchor,
}: TransformJSXOptions<JSXElement>) {
  const openingElementPath = path.get("openingElement");
  const attributesPath = openingElementPath.get("attributes");
  const childrenPath = path.get("children");
  const tag = getTagLiteral(openingElementPath);
  const props = transformJSXComponentProps({
    path: attributesPath,
    template,
    target: targetIdentifier,
    anchor: anchorIdentifier,
  });

  if (isNativeTag(tag)) {
    const elementId = template.element({
      props, tag, target, anchor,
    });
  
    transformJSXChildren({
      path: childrenPath,
      template,
      target: memberExpression(elementId, identifier("el")),
      anchor: undefined,
    });

    template.elementEnd();

  } else {
    if (childrenPath.length) {
      props.properties.push(
        objectProperty(identifier("children"), JSXRoot(childrenPath))
      );
    }
  
    template.component({
      tag, props, target, anchor,
    });
  }
}

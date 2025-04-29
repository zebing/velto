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
import Template from "../template";
import { TransformJSXOptions } from "../types";

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

  } else {
    if (childrenPath.length) {
      const subRender = new Template(template.helper);
      transformJSXChildren({
        path: childrenPath,
        template: subRender,
        target: targetIdentifier,
        anchor: anchorIdentifier,
      });
  
      props.properties.push(
        objectProperty(identifier("children"), subRender.generate())
      );
    }
  
    template.component({
      tag, props, target, anchor,
    });
  }
}

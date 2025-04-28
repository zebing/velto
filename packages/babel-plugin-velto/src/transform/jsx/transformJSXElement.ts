import {
  JSXElement,
  objectProperty,
  identifier,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
  memberExpression,
  Identifier,
  MemberExpression,
  ObjectExpression,
} from "@babel/types";
import { isNativeTag } from "@velto/shared";
import { getTagLiteral } from "../../utils";
import { transformJSXChildren } from "./transformJSXChildren";
import { transformJSXComponentProps } from "./transformJSXComponentProps";
import { anchorIdentifier, targetIdentifier } from "../../constants";
import Template from "../../template";
import { TransformJSXOptions } from "../../types";
import { NodePath } from "@babel/traverse";

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
    handleNativeTag({ path, template, tag, target, anchor, props });
  } else {
    handleComponentTag({
      template,
      tag,
      childrenPath,
      target,
      anchor,
      props,
    });
  }
}

function handleNativeTag({
  path,
  template,
  tag,
  target,
  anchor,
  props,
}: {
  path: NodePath<JSXElement>;
  template: Template;
  tag: string;
  target: Identifier | MemberExpression;
  anchor?: Identifier;
  props: ObjectExpression;
}) {
  const elementId = template.rootPath.scope.generateUidIdentifier("_element");

  template.element({
    elementId,
    props,
    tag,
    target,
    anchor,
  });

  transformJSXChildren({
    path: path.get("children"),
    template,
    target: memberExpression(elementId, identifier("el")),
    anchor: undefined,
  });
}

function handleComponentTag({
  template,
  tag,
  childrenPath,
  target,
  anchor,
  props,
}: {
  template: Template;
  tag: string;
  props: ObjectExpression;
  childrenPath: NodePath<
    JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild | JSXText
  >[];
  target: Identifier | MemberExpression;
  anchor?: Identifier;
}) {
  if (childrenPath.length) {
    const subRender = new Template({
      rootPath: template.rootPath,
    });
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
    tag,
    props,
    target,
    anchor,
  });
}

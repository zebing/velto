import { JSXElement, objectProperty, identifier, JSXAttribute, JSXSpreadAttribute, JSXExpressionContainer, JSXFragment, JSXSpreadChild, JSXText, memberExpression } from "@babel/types";
import { getTagLiteral, isNativeTag } from "../../utils";
import { transformJSXChildren } from "./transformJSXChildren";
import { transformJSX } from "./transformJSX";
import { transformJSXComponentProps } from "./transformJSXComponentProps";
import { anchorIdentifier, targetIdentifier } from "../../constants";
import Template from "../../template";
import { RuntimeHelper } from "../../helper";
import { TransformJSXOptions } from "../../types";
import { setParentId, getParentId } from "../parentId";
import { NodePath } from "@babel/traverse";

export default function transformJSXElement({
  path,
  template,
  root = false,
}: TransformJSXOptions<JSXElement>) {
  const openingElementPath = path.get("openingElement");
  // @ts-ignore
  const attributesPath = openingElementPath.get("attributes");
  const childrenPath = path.get("children");
  const tag = getTagLiteral(openingElementPath);

  if (isNativeTag(tag)) {
    handleNativeTag({ path, template, tag, root });
  } else {
    handleComponentTag({ path, template, tag, root, attributesPath, childrenPath });
  }
}

function handleNativeTag({
  path,
  template,
  tag,
  root,
}: {
  path: NodePath<JSXElement>;
  template: Template;
  tag: string;
  root: boolean;
}) {
  const parentId = getParentId(path);
  const elementId = template.rootPath.scope.generateUidIdentifier("_element");
  setParentId(path, memberExpression(
    elementId,
    identifier('el'),
  ));
  const props = transformJSXComponentProps({
    // @ts-ignore
    path: path.get("openingElement").get("attributes"),
    template,
  });

  template.element({
    elementId,
    props,
    tag,
    target: root ? targetIdentifier : parentId,
    anchor: root ? anchorIdentifier : undefined,
  });

  transformJSXChildren({ path: path.get("children"), template });
}

function handleComponentTag({
  path,
  template,
  tag,
  root,
  attributesPath,
  childrenPath,
}: {
  path: NodePath<JSXElement>;
  template: Template;
  tag: string;
  root: boolean;
  attributesPath: NodePath<JSXAttribute | JSXSpreadAttribute>[];
  childrenPath: NodePath<JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild | JSXText>[];
}) {
  const parentId = getParentId(path);
  const props = transformJSXComponentProps({ path: attributesPath, template });

  if (childrenPath.length) {
    const subRender = new Template({
      rootPath: template.rootPath,
    });
    childrenPath.forEach((childPath) =>
      transformJSX({ path: childPath, template: subRender, root: true })
    );

    props.properties.push(
      objectProperty(identifier("children"), subRender.generate())
    );
  }

  template.component({
    tag,
    props,
    target: root ? targetIdentifier : parentId,
    anchor: root ? anchorIdentifier : undefined,
  });
}

import { JSXElement, objectProperty, identifier, JSXAttribute, JSXSpreadAttribute, JSXExpressionContainer, JSXFragment, JSXSpreadChild, JSXText } from "@babel/types";
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
  const attributesPath = openingElementPath.get("attributes");
  const childrenPath = path.get("children");
  const tag = getTagLiteral(openingElementPath);

  if (isNativeTag(tag)) {
    handleNativeTag({ path, template, tag, root });
  } else {
    handleComponentTag({ path, template, tag, attributesPath, childrenPath });
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
  const id = template.rootPath.scope.generateUidIdentifier(tag);
  setParentId(path, id);
  const props = transformJSXComponentProps({
    path: path.get("openingElement").get("attributes"),
    template,
  });

  template.element({
    id,
    props,
    tag,
    type: root ? RuntimeHelper.insert : RuntimeHelper.append,
    target: root ? targetIdentifier : parentId,
    anchor: root ? anchorIdentifier : undefined,
  });

  transformJSXChildren({ path: path.get("children"), template });
}

function handleComponentTag({
  path,
  template,
  tag,
  attributesPath,
  childrenPath,
}: {
  path: NodePath<JSXElement>;
  template: Template;
  tag: string;
  attributesPath: NodePath<JSXAttribute | JSXSpreadAttribute>[];
  childrenPath: NodePath<JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild | JSXText>[];
}) {
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
  });
}

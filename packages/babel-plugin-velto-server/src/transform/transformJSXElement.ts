import {
  JSXElement,
  objectProperty,
  identifier,
  memberExpression,
  stringLiteral,
  callExpression,
  JSXExpressionContainer,
  JSXFragment,
  StringLiteral,
  JSXAttribute,
  JSXSpreadAttribute,
  JSXSpreadChild,
  JSXText,
  Expression,
} from "@babel/types";
import { NodePath } from "@babel/traverse";
import { isNativeTag } from "@velto/shared";
import { getTagLiteral } from "../utils";
import { transformJSXChildren } from "./transformJSXChildren";
import { transformJSXElementAttribute } from "./transformJSXElementAttribute";
import { transformJSXComponentProps } from "./transformJSXComponentProps";
import { TransformJSXOptions } from "../types";
import TemplateLiteralContext from "../TemplateLiteralContext";
import { getVariableDeclaration } from "../utils";
import { RuntimeHelper } from "../helper";

export function transformJSXElement({
  path,
  context,
}: TransformJSXOptions<JSXElement>) {
  const openingElementPath = path.get("openingElement");
  const attributesPath = openingElementPath.get("attributes");
  const childrenPath = path.get("children");
  const tag = getTagLiteral(openingElementPath);

  if (isNativeTag(tag)) {
    context.pushStringLiteral(stringLiteral(`<${tag}`));

    transformJSXElementAttribute({
      path: attributesPath,
      context,
    });
    context.pushStringLiteral(stringLiteral(`>`));

    handleNativeChildren({
      attributesPath,
      childrenPath,
      context,
    });

    context.pushStringLiteral(stringLiteral(`</${tag}>`));
  } else {
    const props = transformJSXComponentProps({
      path: attributesPath,
      context,
    });
    if (childrenPath.length) {
      const subContext = new TemplateLiteralContext(context);
      transformJSXChildren({
        path: childrenPath,
        context: subContext,
      });

      props.properties.push(
        objectProperty(
          identifier("children"),
          subContext.generateTemplateLiteral()
        )
      );
    }

    const id = path.state.helper.rootPath.scope.generateUidIdentifier(
      `render${tag}`
    );
    context.pushHoistExpressions(
      getVariableDeclaration(
        id,
        path.state.helper.getHelperNameIdentifier(RuntimeHelper.ssrComponent),
        [identifier(tag), props]
      )
    );

    context.pushExpression(callExpression(id, []));
  }
}

function handleNativeChildren({
  attributesPath,
  childrenPath,
  context,
}: {
  attributesPath: NodePath<JSXAttribute | JSXSpreadAttribute>[];
  childrenPath: NodePath<
    JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild | JSXText
  >[];
  context: TemplateLiteralContext;
}) {
  let attributeChildrenValuePath:
    | NodePath<
        | JSXElement
        | JSXFragment
        | StringLiteral
        | JSXExpressionContainer
        | null
        | undefined
      >
    | undefined = undefined;
  let isTextContent = false;
  attributesPath.forEach((attribute) => {
    if (attribute.isJSXAttribute()) {
      const nameLiteral = attribute.get("name").getSource();
      const value = attribute.get("value");

      if (["innerHTML", "textContent"].includes(nameLiteral) && value.node) {
        attributeChildrenValuePath = value;
        isTextContent = nameLiteral === "textContent";
      }
    }
  });

  if (isTextContent && attributeChildrenValuePath) {
    const path = attributeChildrenValuePath as NodePath
    const escapeHtml = path.state.helper.getHelperNameIdentifier(RuntimeHelper.ssrEscapeHtml);
    const value = path.isJSXExpressionContainer()
    ? path.get("expression").node as Expression
    : stringLiteral(path.getSource());

    context.pushExpression(
      callExpression(
        escapeHtml,
        [ value ]
      )
    );
    return;
  }

  const finalChildrenPath = attributeChildrenValuePath
    ? [attributeChildrenValuePath]
    : childrenPath;

  transformJSXChildren({
    path: finalChildrenPath,
    context,
  });
}

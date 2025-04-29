import {
  JSXSpreadAttribute,
  objectProperty,
  ObjectProperty,
  identifier,
  Expression,
  SpreadElement,
  spreadElement,
  objectExpression,
  booleanLiteral,
} from "@babel/types";
import { transformJSXElement } from "./transformJSXElement";
import { transformJSXFragment } from "./transformJSXFragment";
import Template from "../template";
import { TransformJSXChildrenOptions } from "../types";
import { anchorIdentifier, targetIdentifier } from "../constants";
import { isEvent } from "@velto/shared";

export function transformJSXComponentProps({
  path,
  template,
}: TransformJSXChildrenOptions) {
  const properties: (ObjectProperty | SpreadElement)[] = [];

  path.forEach((attribute) => {
    // JSXAttribute
    if (attribute.isJSXAttribute()) {
      const nameLiteral = attribute.get("name").getSource();
      const value = attribute.get("value");

      // JSXFragment <div child=<></>></div>
      if (value.isJSXFragment()) {
        const subRender = new Template(template.helper);
        transformJSXFragment({
          path: value,
          template: subRender,
          target: targetIdentifier,
          anchor: anchorIdentifier,
        });
        properties.push(
          objectProperty(identifier(nameLiteral), subRender.generate())
        );

        // JSXElement <div child=<div></div>></div>
      } else if (value.isJSXElement()) {
        const subRender = new Template(template.helper);
        transformJSXElement({
          path: value,
          template: subRender,
          target: targetIdentifier,
          anchor: anchorIdentifier,
        });
        properties.push(
          objectProperty(identifier(nameLiteral), subRender.generate())
        );

        // JSXExpressionContainer
        // {expression}
      } else if (value.isJSXExpressionContainer()) {
        const expression = value.get("expression");

        if (isEvent(nameLiteral) && (expression.isFunctionExpression() || expression.isArrowFunctionExpression())) {
          const eventName = template.hoistHandle(expression.node);

          properties.push(
            objectProperty(
              identifier(nameLiteral),
              eventName,
            )
          );

        // JSXFragment <div child=<></>></div>
        } else if (expression.isJSXFragment()) {
          const subRender = new Template(template.helper);
          transformJSXFragment({
            path: expression,
            template: subRender,
            target: targetIdentifier,
            anchor: anchorIdentifier,
          });
          properties.push(
            objectProperty(identifier(nameLiteral), subRender.generate())
          );

          // JSXElement <div child=<div></div>></div>
        } else if (expression.isJSXElement()) {
          const subRender = new Template(template.helper);
          transformJSXElement({
            path: expression,
            template: subRender,
            target: targetIdentifier,
            anchor: anchorIdentifier,
          });
          properties.push(
            objectProperty(identifier(nameLiteral), subRender.generate())
          );
        } else {
          properties.push(
            objectProperty(
              identifier(nameLiteral),
              expression.node as Expression
            )
          );
        }
      } else if (!value.type) {
        properties.push(
          objectProperty(identifier(nameLiteral), booleanLiteral(true))
        );
      } else if (value) {
        properties.push(
          objectProperty(identifier(nameLiteral), value.node as Expression)
        );
      }

      // JSXSpreadAttribute
    } else {
      properties.push(
        spreadElement((attribute.node as JSXSpreadAttribute).argument)
      );
    }
  });

  return objectExpression(properties);
}

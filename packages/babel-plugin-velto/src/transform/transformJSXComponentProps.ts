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
import { TransformJSXChildrenOptions } from "../types";
import { isEvent } from "@velto/shared";
import JSXRoot from "./";

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
        properties.push(
          objectProperty(identifier(nameLiteral), JSXRoot(value))
        );

        // JSXElement <div child=<div></div>></div>
      } else if (value.isJSXElement()) {
        properties.push(
          objectProperty(identifier(nameLiteral), JSXRoot(value))
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
          properties.push(
            objectProperty(identifier(nameLiteral), JSXRoot(expression))
          );

          // JSXElement <div child=<div></div>></div>
        } else if (expression.isJSXElement()) {
          properties.push(
            objectProperty(identifier(nameLiteral), JSXRoot(expression))
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

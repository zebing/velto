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
// import Template from "../template";
import { TransformJSXChildrenOptions } from "../types";
import { isEvent } from "@velto/shared";
import TemplateLiteralContext from "../TemplateLiteralContext";

export function transformJSXComponentProps({
  path,
  context,
}: TransformJSXChildrenOptions) {
  const properties: (ObjectProperty | SpreadElement)[] = [];

  path.forEach((attribute) => {
    // JSXAttribute
    if (attribute.isJSXAttribute()) {
      const nameLiteral = attribute.get("name").getSource();
      const value = attribute.get("value");

      // JSXFragment <div child=<></>></div>
      if (value.isJSXFragment()) {
        const subContext = new TemplateLiteralContext(context.indentLevel, context);
        transformJSXFragment({
          path: value,
          context: subContext,
        });
        properties.push(
          objectProperty(identifier(nameLiteral), subContext.generateTemplateLiteral())
        );

        // JSXElement <div child=<div></div>></div>
      } else if (value.isJSXElement()) {
        const subContext = new TemplateLiteralContext(context.indentLevel, context);
        transformJSXElement({
          path: value,
          context: subContext,
        });
        properties.push(
          objectProperty(identifier(nameLiteral), subContext.generateTemplateLiteral())
        );

        // JSXExpressionContainer
        // {expression}
      } else if (value.isJSXExpressionContainer()) {
        const expression = value.get("expression");

        // JSXFragment <div child=<></>></div>
        if (expression.isJSXFragment()) {
          const subContext = new TemplateLiteralContext(context.indentLevel, context);
          transformJSXFragment({
            path: expression,
            context: subContext,
          });
          properties.push(
            objectProperty(identifier(nameLiteral), subContext.generateTemplateLiteral())
          );

          // JSXElement <div child=<div></div>></div>
        } else if (expression.isJSXElement()) {
          const subContext = new TemplateLiteralContext(context.indentLevel, context);
          transformJSXElement({
            path: expression,
            context: subContext,
          });
          properties.push(
            objectProperty(identifier(nameLiteral), subContext.generateTemplateLiteral())
          );
        } else {
          properties.push(
            objectProperty(
              identifier(nameLiteral),
              expression.node as Expression
            )
          );
        }
      } else if (value.node) {
        properties.push(
          objectProperty(identifier(nameLiteral), value.node as Expression)
        );
      } else {
        properties.push(
          objectProperty(identifier(nameLiteral), booleanLiteral(true))
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

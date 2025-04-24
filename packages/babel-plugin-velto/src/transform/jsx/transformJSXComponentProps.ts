import {
  JSXSpreadAttribute,
  objectProperty,
  ObjectProperty,
  identifier,
  Expression,
  SpreadElement,
  spreadElement,
  booleanLiteral,
  nullLiteral,
  variableDeclaration,
  variableDeclarator,
} from "@babel/types";
import { NodePath } from "@babel/traverse";
import { transformJSXElement } from "./transformJSXElement";
import { transformJSXFragment } from "./transformJSXFragment";
import { isEvent } from "@velto/shared";

export function transformJSXComponentProps(path: NodePath<unknown>[]) {
  return path.map((attribute): ObjectProperty | SpreadElement => {
    const { helper } = attribute.state;

    // JSXAttribute
    if (attribute.isJSXAttribute()) {
      const nameLiteral = attribute.get("name").getSource();
      const value = attribute.get("value");

      // JSXElement <div child=<div></div>></div>
      if (value.isJSXElement()) {
        return objectProperty(
          identifier(nameLiteral),
          transformJSXElement(value)
        );

        // JSXFragment <div child=<></>></div>
      } else if (value.isJSXFragment()) {
        return objectProperty(
          identifier(nameLiteral),
          transformJSXFragment(value)
        );

        // JSXExpressionContainer
        // {expression}
      } else if (value.isJSXExpressionContainer()) {
        const expression = value.get("expression");

        if (
          isEvent(nameLiteral) &&
          (expression.isFunctionExpression() ||
            expression.isArrowFunctionExpression())
        ) {
          const eventName =
            helper.rootPath.scope.generateUidIdentifier("handle");
          helper.bodyStatement.push(
            variableDeclaration("const", [
              variableDeclarator(eventName, expression.node as Expression),
            ])
          );
          return objectProperty(identifier(nameLiteral), eventName);

          // JSXElement <div child=<div></div>></div>
        } else if (expression.isJSXElement()) {
          return objectProperty(
            identifier(nameLiteral),
            transformJSXElement(expression)
          );

          // JSXFragment <div child=<></>></div>
        } else if (expression.isJSXFragment()) {
          return objectProperty(
            identifier(nameLiteral),
            transformJSXFragment(expression)
          );
        } else {
          return objectProperty(
            identifier(nameLiteral),
            expression.node as Expression
          );
        }
      } else if (!value.type) {
        return objectProperty(identifier(nameLiteral), booleanLiteral(true));
      } else if (value) {
        return objectProperty(
          identifier(nameLiteral),
          value.node as Expression
        );
      } else {
        return objectProperty(identifier(nameLiteral), nullLiteral());
      }

      // JSXSpreadAttribute
    } else {
      return spreadElement((attribute.node as JSXSpreadAttribute).argument);
    }
  });
}

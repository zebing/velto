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
  stringLiteral,
  callExpression,
  memberExpression,
  arrowFunctionExpression,
  templateLiteral,
  templateElement,
  arrayPattern,
  JSXAttribute,
} from "@babel/types";
import { NodePath } from "@babel/traverse";
import { TransformJSXChildrenOptions } from "../types";
import { isEvent } from "@velto/shared";

export function transformJSXElementAttribute({
  path,
  context,
}: TransformJSXChildrenOptions) {
  path.forEach((attribute) => {
    // JSXSpreadAttribute
    if (attribute.isJSXSpreadAttribute()) {
      handleJSXSpreadAttribute(attribute, context);
      return;
    }

    // JSXAttribute
    if (attribute.isJSXAttribute()) {
      handleJSXAttribute(attribute, context);
    }
  });
}

function handleJSXAttribute(attribute: NodePath<JSXAttribute>, context: TransformJSXChildrenOptions['context']) {
  const nameLiteral = attribute.get("name").getSource();
  const value = attribute.get("value");

  // JSXFragment <div child=<></>></div>
  // JSXElement <div child=<div></div>></div>
  if (value.isJSXFragment() || value.isJSXElement()) {
    context.pushStringLiteral(
      stringLiteral(` ${nameLiteral}='${value.getSource()}'`)
    );
    return;
  }

  if (value.isJSXExpressionContainer()) {
    const expression = value.get("expression");

    if (expression.isJSXFragment() || expression.isJSXElement()) {
      context.pushStringLiteral(
        stringLiteral(` ${nameLiteral}=${expression.getSource()}`)
      );
      
    } else if (!(isEvent(nameLiteral) || ['ref'].includes(nameLiteral))) {
      context.pushStringLiteral(
        stringLiteral(` ${nameLiteral}=`)
      );
      context.pushExpression(expression.node as Expression);
    }

  } else if (value.node) {
    context.pushStringLiteral(
      stringLiteral(` ${nameLiteral}='${value.getSource()}'`)
    );

  } else {
    context.pushStringLiteral(stringLiteral(` ${nameLiteral}="true"`))
  }
}

function handleJSXSpreadAttribute(attribute: NodePath<JSXSpreadAttribute>, context: TransformJSXChildrenOptions['context']) {
  context.pushExpression(
    callExpression(
      memberExpression(
        callExpression(
          memberExpression(
            identifier('Object'),
            identifier('entries'),
          ),
          [(attribute.node as JSXSpreadAttribute).argument]
        ),
        identifier('map'),
      ),
      [
        arrowFunctionExpression(
          [arrayPattern([identifier('key'), identifier('value')])],
          templateLiteral(
            [
              templateElement({ raw: ' ', cooked: ' ' }, false),
              templateElement({ raw: '=', cooked: '=' }, false),
              templateElement({ raw: '', cooked: '' }, true),
            ],
            [identifier('key'), identifier('value')]
          ),
        )
      ]
    )
  );
}
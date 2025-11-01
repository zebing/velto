import {
  JSXSpreadAttribute,
  Expression,
  stringLiteral,
  callExpression,
  JSXAttribute,
  isStringLiteral,
} from "@babel/types";
import { NodePath } from "@babel/traverse";
import { TransformJSXChildrenOptions } from "../types";
import { isEvent, isBooleanAttribute } from "@velto/shared";
import { RuntimeHelper } from "../helper";

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

function handleJSXAttribute(
  attribute: NodePath<JSXAttribute>,
  context: TransformJSXChildrenOptions["context"]
) {
  const nameLiteral = attribute.get("name").getSource();
  const value = attribute.get("value");

  if (
    isEvent(nameLiteral) ||
    ["innerHTML", "textContent", "ref"].includes(nameLiteral)
  ) {
    return;
  }

  let resultValue: Expression | string;

  if (value.isJSXExpressionContainer()) {
    const expression = value.get("expression");
    resultValue = expression.node as Expression;
  } else {
    resultValue = stringLiteral(value.getSource() || "true");
  }

  if (isBooleanAttribute(nameLiteral)) {
    resultValue = stringLiteral("");
  }

  let helperId: string;

  if (nameLiteral === "class") {
    helperId = RuntimeHelper.ssrClass;
  } else if (nameLiteral === "style") {
    helperId = RuntimeHelper.ssrStyle;
  } else {
    helperId = RuntimeHelper.ssrAttribute;
  }

  if (isStringLiteral(resultValue)) {
    context.pushStringLiteral(
      stringLiteral(` ${nameLiteral}=${resultValue.value}`)
    );
  } else {
    context.pushStringLiteral(stringLiteral(` ${nameLiteral}='`));
    context.pushExpression(
      callExpression(attribute.state.helper.getHelperNameIdentifier(helperId), [
        resultValue,
      ])
    );
    context.pushStringLiteral(stringLiteral(`'`));
  }
}

function handleJSXSpreadAttribute(
  attribute: NodePath<JSXSpreadAttribute>,
  context: TransformJSXChildrenOptions["context"]
) {
  context.pushExpression(
    callExpression(
      attribute.state.helper.getHelperNameIdentifier(RuntimeHelper.ssrSpreadAttribute), 
      [(attribute.node as JSXSpreadAttribute).argument]
    )
  );
}

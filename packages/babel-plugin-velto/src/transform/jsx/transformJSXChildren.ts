import {
  JSXText,
  CallExpression,
  StringLiteral,
  stringLiteral,
  Expression,
  callExpression,
} from "@babel/types";
import { NodePath } from "@babel/traverse";
import { transformJSXElement } from "./transformJSXElement";
import { transformJSXFragment } from "./transformJSXFragment";
import { transformJSXLogicalExpression } from "./transformJSXLogicalExpression";
import { transformJSXConditionalExpression } from "./transformJSXConditionalExpression";
import { transformJSXExpression } from "./transformJSXExpression";
import { RuntimeHelper } from "../../helper";

export function transformJSXChildren(path: NodePath[]) {
  const childrenList: (CallExpression | StringLiteral)[] = [];
  path.map((children) => {
    // JSXElement
    if (children.isJSXElement()) {
      childrenList.push(transformJSXElement(children));

      // JSXFragment
    } else if (children.isJSXFragment()) {
      childrenList.push(transformJSXFragment(children));

      // JSXExpressionContainer
    } else if (children.isJSXExpressionContainer()) {
      const expression = children.get("expression");

      // JSXElement
      if (expression.isJSXElement()) {
        childrenList.push(transformJSXElement(expression));

        // JSXFragment
      } else if (expression.isJSXFragment()) {
        childrenList.push(transformJSXFragment(expression));

        // LogicalExpression
      } else if (expression.isLogicalExpression()) {
        childrenList.push(...transformJSXLogicalExpression(expression));

        // ConditionalExpression
      } else if (expression.isConditionalExpression()) {
        childrenList.push(...transformJSXConditionalExpression(expression));

        // ignore JSXEmptyExpression
      } else if (!expression.isJSXEmptyExpression()) {
        childrenList.push(
          transformJSXExpression(expression as NodePath<Expression>)
        );
      }

      // JSXSpreadChild
    } else if (children.isJSXSpreadChild()) {
      childrenList.push(
        transformJSXExpression(
          children.get("expression") as NodePath<Expression>
        )
      );

      // JSXText
    } else {
      const str = (children.node as JSXText).value;
      // 过滤 "\n      ..." 字符
      if (!/^\n\s+$/gi.test(str)) {
        childrenList.push(
          callExpression(
            children.state.helper.getHelperNameIdentifier(RuntimeHelper.text),
            [stringLiteral(str)],
          )
        );
      }
    }
  });

  return childrenList;
}

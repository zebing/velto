import { NodePath } from "@babel/core";
import {
  Expression,
  Identifier,
  isNullLiteral,
  isIdentifier,
  callExpression,
  CallExpression,
  arrowFunctionExpression,
} from "@babel/types";
import { transformJSXConditionalExpression } from "./transformJSXConditionalExpression";
import { transformJSXLogicalExpression } from "./transformJSXLogicalExpression";
import { transformJSXElement } from "./transformJSXElement";
import { transformJSXFragment } from "./transformJSXFragment";
import { transformJSXExpression } from "./transformJSXExpression";
import { RuntimeHelper } from "../../helper";

export function transformJSXConsequentExpression(
  consequent: NodePath<Expression>,
  test: Expression
): CallExpression[] {
  const { helper } = consequent.state;
  const id = consequent.state.helper.getHelperNameIdentifier(
    RuntimeHelper.condition
  );
  const expressionList: CallExpression[] = [];

  if (consequent.isJSXElement()) {
    expressionList.push(
      getCoditionCallExpression(
        id,
        arrowFunctionExpression([], test),
        transformJSXElement(consequent)
      )
    );
  } else if (consequent.isJSXFragment()) {
    expressionList.push(
      getCoditionCallExpression(
        id,
        arrowFunctionExpression([], test),
        transformJSXFragment(consequent)
      )
    );

    // ConditionalExpression
    // expression ? <div></div> : null
  } else if (consequent.isConditionalExpression()) {
    const expressList = transformJSXConditionalExpression(consequent, test);
    expressList.forEach((express) => {
      expressionList.push(
        getCoditionCallExpression(
          id,
          arrowFunctionExpression([], test),
          express
        )
      );
    });

    // LogicalExpression
    // expression && <div></div>
  } else if (consequent.isLogicalExpression()) {
    const expressList = transformJSXLogicalExpression(consequent, test);
    expressList.forEach((express) => {
      expressionList.push(
        getCoditionCallExpression(
          id,
          arrowFunctionExpression([], test),
          express
        )
      );
    });
  } else if (
    !isNullLiteral(consequent.node) &&
    !(isIdentifier(consequent.node) && consequent.node.name === "undefined")
  ) {
    expressionList.push(
      getCoditionCallExpression(
        id,
        arrowFunctionExpression([], test),
        transformJSXExpression(consequent)
      )
    );
  }

  return expressionList;
}

function getCoditionCallExpression(
  id: Identifier,
  test: Expression,
  express: CallExpression
) {
  return callExpression(id, [test, express]);
}

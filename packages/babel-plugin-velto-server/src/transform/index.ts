import { NodePath } from "@babel/traverse";
import {stringLiteral, returnStatement, JSXElement, JSXFragment, Statement, callExpression, arrowFunctionExpression, blockStatement, templateLiteral, templateElement } from "@babel/types";
import { transformJSXElement } from "./transformJSXElement";
import { transformJSXFragment } from './transformJSXFragment'
import { RuntimeHelper } from "../helper";
import TemplateLiteralContext from "../TemplateLiteralContext";

export default function JSXRoot(path: NodePath<JSXElement | JSXFragment>) {
  const context = new TemplateLiteralContext();

  if (path.isJSXFragment()) {
    transformJSXFragment({
      path,
      context,
    });
  } else {
    transformJSXElement({
      path: path as NodePath<JSXElement>,
      context,
    });
  }

  const statement = path.getStatementParent();

  statement!.insertBefore(
    context.hoistExpressions
  )
  path.replaceWith(callExpression(
    path.state.helper.getHelperNameIdentifier(
      RuntimeHelper.markRender
    ),
    [
      arrowFunctionExpression(
        [],
        blockStatement([
          returnStatement(
            context.generateTemplateLiteral(),
          ),
        ])
      ),
    ]
  ));
}

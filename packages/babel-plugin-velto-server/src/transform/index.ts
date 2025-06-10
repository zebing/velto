import { NodePath } from "@babel/traverse";
import {stringLiteral, returnStatement, JSXElement, JSXFragment, Statement, callExpression, arrowFunctionExpression, blockStatement } from "@babel/types";
// import { transformJSXElement } from "./transformJSXElement";
// import { transformJSXFragment } from './transformJSXFragment'
import { RuntimeHelper } from "../helper";

export default function JSXRoot(path: NodePath<JSXElement | JSXFragment>) {
  const hoistList: Statement[] = [];

  // if (path.isJSXFragment()) {
  //   transformJSXFragment({
  //     path,
  //     template,
  //     target: targetIdentifier,
  //     anchor: anchorIdentifier,
  //   });
  // } else {
  //   transformJSXElement({
  //     path: path as NodePath<JSXElement>,
  //     template,
  //     target: targetIdentifier,
  //     anchor: anchorIdentifier,
  //   });
  // }

  const node = callExpression(
    path.state.helper.getHelperNameIdentifier(
        RuntimeHelper.markRender
      ),
      [
        arrowFunctionExpression(
          [],
          blockStatement([
            ...hoistList,
            returnStatement(
              stringLiteral(
                path.getSource()
              )
            ),
          ])
        ),
      ]
    );
  
  path.replaceWith(node);
}

import {
  Identifier,
  identifier,
  blockStatement,
  Statement,
  returnStatement,
  objectExpression,
  objectMethod,
  variableDeclaration,
  variableDeclarator,
  callExpression,
  stringLiteral,
  expressionStatement,
  Expression,
  StringLiteral,
  memberExpression,
  MemberExpression,
  ObjectExpression,
  objectProperty,
  booleanLiteral,
  BlockStatement,
  arrowFunctionExpression,
  ReturnStatement,
  JSXElement,
  isCallExpression,
  ArrowFunctionExpression,
  isBlockStatement,
  CallExpression,
  JSXFragment,
} from "@babel/types";
import { NodePath } from "@babel/traverse";
import { targetIdentifier, anchorIdentifier } from "../constants";
import { HelperNameType } from "../helper";
import { NodePathState } from "../types";

export interface RenderOption {
  rootPath: NodePath;
}

export default class Render {
  public rootPath: NodePath;
  private pathState: NodePathState;
  private bodyStatement: Statement[] = [];
  private renderStatement: Statement[] = [];
  private destroyStatement: Statement[] = [];

  constructor(options: RenderOption) {
    const { rootPath } = options || {};
    this.rootPath = rootPath;
    this.pathState = rootPath.state as NodePathState;
  }

  public space(target: Identifier) {
    const id = this.rootPath.scope.generateUidIdentifier("spaceAnchor");
    this.pushBodyStatement({
      id,
      callee: this.pathState.helper.getHelperNameIdentifier(
        HelperNameType.text
      ),
      argumentList: [stringLiteral(" ")],
    });
    this.pushRenderStatement({
      callee: this.pathState.helper.getHelperNameIdentifier(
        HelperNameType.append
      ),
      argumentList: [target, id],
    });
    return id;
  }

  public element(options: {
    id: Identifier;
    tag: string;
    type: HelperNameType;
    props: ObjectExpression;
    target: Identifier;
    anchor?: Identifier;
  }) {
    const {
      tag,
      type = HelperNameType.insert,
      props,
      target,
      anchor,
      id,
    } = options;

    this.pushBodyStatement({
      id,
      callee: this.pathState.helper.getHelperNameIdentifier(
        HelperNameType.createElement
      ),
      argumentList: [stringLiteral(tag)],
    });

    const elementId = this.rootPath.scope.generateUidIdentifier("_element");

    this.pushBodyStatement({
      id: elementId,
      callee: this.pathState.helper.getHelperNameIdentifier(
        HelperNameType.element
      ),
      argumentList: [
        arrowFunctionExpression(
          [],
          objectExpression([
            objectProperty(identifier("el"), id),
            objectProperty(identifier("props"), props),
            objectProperty(identifier("type"), stringLiteral(type)),
          ])
        ),
      ],
    });

    this.pushRenderStatement({
      argumentList: [target, anchor].filter(Boolean) as Identifier[],
      callee: memberExpression(elementId, identifier("render")),
    });

    this.pushDestroyStatement({
      callee: memberExpression(elementId, identifier("destroy")),
      argumentList: [],
    });

    return id;
  }

  public text(options: {
    str: StringLiteral;
    type: HelperNameType.insert | HelperNameType.append;
    target: Identifier;
    anchor?: Identifier;
  }) {
    const { str, type, target, anchor } = options;
    const id = this.rootPath.scope.generateUidIdentifier("text");
    this.pushBodyStatement({
      id,
      callee: this.pathState.helper.getHelperNameIdentifier(
        HelperNameType.text
      ),
      argumentList: [str],
    });

    this.pushRenderStatement({
      argumentList: [target, id, anchor].filter(Boolean) as Identifier[],
      callee: this.pathState.helper.getHelperNameIdentifier(type),
    });

    this.pushDestroyStatement({
      callee: this.pathState.helper.getHelperNameIdentifier(
        HelperNameType.remove
      ),
      argumentList: [id],
    });

    return id;
  }

  public component(options: { tag: string; props: ObjectExpression }) {
    const { tag, props } = options;
    const id = this.rootPath.scope.generateUidIdentifier("_component");
    this.pushBodyStatement({
      id,
      callee: this.pathState.helper.getHelperNameIdentifier(
        HelperNameType.component
      ),
      argumentList: [identifier(tag), props],
    });

    this.pushRenderStatement({
      callee: memberExpression(id, identifier("render")),
      argumentList: [targetIdentifier, anchorIdentifier],
    });

    this.pushDestroyStatement({
      callee: memberExpression(id, identifier("destroy")),
      argumentList: [],
    });

    return id;
  }

  public expression(options: {
    express: Expression;
    target: Identifier;
    anchor?: Identifier;
    test?: Expression;
  }) {
    const {
      express,
      target = targetIdentifier,
      anchor = anchorIdentifier,
      test,
    } = options;
    const expressId = this.rootPath.scope.generateUidIdentifier("express");
    const conditionId = this.rootPath.scope.generateUidIdentifier("condition");
    let id = expressId;
    this.pushBodyStatement({
      id: expressId,
      callee: this.pathState.helper.getHelperNameIdentifier(
        HelperNameType.expression
      ),
      argumentList: [arrowFunctionExpression([], express)],
    });

    if (test) {
      id = conditionId;
      this.pushBodyStatement({
        id: conditionId,
        callee: this.pathState.helper.getHelperNameIdentifier(
          HelperNameType.condition
        ),
        argumentList: [expressId, arrowFunctionExpression([], test)],
      });
    }

    this.pushRenderStatement({
      argumentList: [target, anchor].filter(Boolean) as Identifier[],
      callee: memberExpression(id, identifier("render")),
    });

    this.pushDestroyStatement({
      callee: memberExpression(id, identifier("destroy")),
      argumentList: [],
    });

    return id;
  }

  // callee(id)
  // callee()
  public pushBodyStatement(options: {
    kind?: "var" | "let" | "const";
    callee: Expression;
    id: Identifier;
    argumentList: Expression[];
  }) {
    const { id, callee, argumentList, kind = "const" } = options;
    const express = callExpression(callee, argumentList);

    this.bodyStatement.push(
      variableDeclaration(kind, [variableDeclarator(id, express)])
    );
  }

  // callee(target, id, anchor)
  // callee(target, anchor)
  public pushRenderStatement(options: {
    callee: Expression;
    argumentList: Expression[];
  }) {
    const { callee, argumentList } = options;

    const expression = expressionStatement(
      callExpression(callee, argumentList)
    );

    this.renderStatement.push(expression);
  }

  // callee(id)
  // callee()
  public pushDestroyStatement(options: {
    callee: Expression;
    argumentList: Expression[];
  }) {
    const { callee, argumentList } = options;

    const expression = expressionStatement(
      callExpression(callee, argumentList)
    );

    this.destroyStatement.push(expression);
  }
  private renderList(path: NodePath<JSXElement | JSXFragment>) {
    const renderListCallback = path.getFunctionParent();
    const bodyPath = renderListCallback?.get("body");
    const returnStatementNode =
      isBlockStatement(bodyPath?.node) && bodyPath.node.body[bodyPath.node.body.length - 1];
    const callee = (renderListCallback?.parentPath?.node as CallExpression)
      ?.callee as MemberExpression;
    const isCallMap =
      isCallExpression(renderListCallback?.parentPath.node) &&
      (callee?.property as Identifier)?.name === "map";

    if (
      isCallMap &&
      // 1. list.map(() => { return <div></div> })
      // 2. list.map(function () { return <div></div> })
      ((returnStatementNode as ReturnStatement)?.argument === path.node ||
        // list.map(() => <div></div>)
        renderListCallback?.node.body === path.node)
    ) {
      const { params = [], body } = renderListCallback.node;

      if (params.length) {
        const [
          element = path.scope.generateUidIdentifier("element"),
          index = path.scope.generateUidIdentifier("index"),
          array = path.scope.generateUidIdentifier("array"),
        ] = params;

        (body as BlockStatement).body.unshift(
          variableDeclaration("const", [
            variableDeclarator(
              element,
              memberExpression(array as Identifier, index as Identifier, true)
            ),
          ])
        );
        
        renderListCallback.node = {
          ...renderListCallback.node,
          params: [identifier("_"), index, array],
        } as ArrowFunctionExpression;
      }

      const renderListExpression = callExpression(
        path.state.helper.getHelperNameIdentifier(HelperNameType.renderList),
        [callee.object, renderListCallback.node as ArrowFunctionExpression]
      );
      renderListCallback.parentPath.replaceWith(renderListExpression);
    }
  }

  public generate() {
    const functionParent = this.rootPath.getFunctionParent();

    if (functionParent) {
      const bodyPath = functionParent.get("body");
      if (!bodyPath.isBlockStatement()) {
        functionParent.replaceWith(
          arrowFunctionExpression(
            // @ts-ignore
            functionParent.node.params,
            blockStatement([returnStatement(bodyPath.node as Expression)])
          )
        );
      }

      const blockStatementBodyPath = bodyPath.get("body");

      if (Array.isArray(blockStatementBodyPath)) {
        const lastExpress =
          blockStatementBodyPath[
            (
              blockStatementBodyPath as unknown as NodePath<
                ReturnStatement | Expression
              >[]
            ).length - 1
          ];
        if (lastExpress.isReturnStatement()) {
          lastExpress?.insertBefore(this.bodyStatement);
        } else {
          (bodyPath as unknown as NodePath<BlockStatement>).pushContainer(
            "body",
            this.bodyStatement
          );
        }
      }
    } else {
      const statementPath = this.rootPath.getStatementParent();
      statementPath?.insertBefore(this.bodyStatement);
    }

    const isJSX = this.pathState.helper.getHelperNameIdentifier(
      HelperNameType.isJSX
    );

    if (this.rootPath.isJSXElement() || this.rootPath.isJSXFragment()) {
      this.renderList(this.rootPath as NodePath<JSXElement | JSXFragment>);
    }

    return objectExpression([
      objectProperty(isJSX, booleanLiteral(true), true),
      objectMethod(
        "method",
        identifier("render"),
        [targetIdentifier, anchorIdentifier],
        blockStatement(this.renderStatement)
      ),
      objectMethod(
        "method",
        identifier("destroy"),
        [],
        blockStatement(this.destroyStatement)
      ),
    ]);
  }
}

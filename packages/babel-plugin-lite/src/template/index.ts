import {
  Identifier,
  identifier,
  blockStatement,
  Statement,
  returnStatement,
  objectExpression,
  objectMethod,
  callExpression,
  stringLiteral,
  Expression,
  StringLiteral,
  memberExpression,
  MemberExpression,
  ObjectExpression,
  arrowFunctionExpression,
  ReturnStatement,
  isCallExpression,
  isBlockStatement,
  CallExpression,
  variableDeclaration,
  variableDeclarator,
  isReturnStatement,
  isMemberExpression,
  Node,
  isArrowFunctionExpression,
  isFunctionExpression,
  isJSXElement,
  isJSXFragment,
} from "@babel/types";
import { NodePath } from "@babel/traverse";
import {
  targetIdentifier,
  anchorIdentifier,
  mountIdentifier,
  updateIdentifier,
  destroyIdentifier,
  reactiveIdentifier,
} from "../constants";
import { RuntimeHelper } from "../helper";
import { NodePathState } from "../types";
import { getExpressionStatement, getVariableDeclaration } from "../utils";
import { getExpressionUpdateStatement, getRenderList } from "./util";

export interface RenderOption {
  rootPath: NodePath;
}

export default class Template {
  public rootPath: NodePath;
  private pathState: NodePathState;
  private bodyStatement: Statement[] = [];
  private mountStatement: Statement[] = [];
  private updateStatement: Statement[] = [];
  private destroyStatement: Statement[] = [];

  constructor(options: RenderOption) {
    const { rootPath } = options || {};
    this.rootPath = rootPath;
    this.pathState = rootPath.state as NodePathState;
  }

  public space(target: Identifier) {
    const id = this.rootPath.scope.generateUidIdentifier("spaceAnchor");
    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.text),
        [stringLiteral(" ")]
      )
    );

    this.mountStatement.push(
      getExpressionStatement(
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.append),
        [target, id]
      )
    );
    return id;
  }

  public element(options: {
    id: Identifier;
    tag: string;
    type: RuntimeHelper;
    props: ObjectExpression;
    target: Identifier;
    anchor?: Identifier;
  }) {
    const {
      tag,
      type = RuntimeHelper.insert,
      props,
      target,
      anchor,
      id,
    } = options;

    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.pathState.helper.getHelperNameIdentifier(
          RuntimeHelper.createElement
        ),
        [stringLiteral(tag)]
      )
    );

    const elementId = this.rootPath.scope.generateUidIdentifier("_element");

    this.bodyStatement.push(
      getVariableDeclaration(
        elementId,
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.element),
        [id, props, this.pathState.helper.getHelperNameIdentifier(type)]
      )
    );

    this.mountStatement.push(
      getExpressionStatement(
        memberExpression(elementId, mountIdentifier),
        [target, anchor].filter(Boolean) as Identifier[]
      )
    );

    this.updateStatement.push(
      getExpressionStatement(memberExpression(elementId, updateIdentifier), [
        props,
      ])
    );

    this.destroyStatement.push(
      getExpressionStatement(memberExpression(elementId, destroyIdentifier), [])
    );

    return id;
  }

  public text(options: {
    str: StringLiteral;
    type: RuntimeHelper.insert | RuntimeHelper.append;
    target: Identifier;
    anchor?: Identifier;
  }) {
    const { str, type, target, anchor } = options;
    const id = this.rootPath.scope.generateUidIdentifier("text");

    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.text),
        [str]
      )
    );

    this.mountStatement.push(
      getExpressionStatement(
        this.pathState.helper.getHelperNameIdentifier(type),
        [target, id, anchor].filter(Boolean) as Identifier[]
      )
    );

    this.destroyStatement.push(
      getExpressionStatement(
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.remove),
        [id]
      )
    );

    return id;
  }

  public component(options: { tag: string; props: ObjectExpression }) {
    const { tag, props } = options;
    const id = this.rootPath.scope.generateUidIdentifier("_component");
    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.component),
        [identifier(tag), props]
      )
    );

    this.mountStatement.push(
      getExpressionStatement(memberExpression(id, mountIdentifier), [
        targetIdentifier,
        anchorIdentifier,
      ])
    );

    this.destroyStatement.push(
      getExpressionStatement(memberExpression(id, destroyIdentifier), [])
    );

    return id;
  }

  public expression(options: {
    express: Expression;
    target: Identifier;
    anchor?: Identifier;
    test?: Expression;
  }) {
    const { express, target = targetIdentifier, anchor = anchorIdentifier, test } = options;
    const expressId = this.rootPath.scope.generateUidIdentifier("express");
    const conditionId = this.rootPath.scope.generateUidIdentifier("condition");
    let renderListId: Identifier | undefined;
    let id = expressId;
  
    const renderListExpression = getRenderList(express, this.rootPath);
    if (renderListExpression) {
      renderListId = this.rootPath.scope.generateUidIdentifier("renderList");
      this.bodyStatement.push(
        variableDeclaration("const", [
          variableDeclarator(renderListId, renderListExpression),
        ])
      );
    }
  
    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.expression),
        [renderListId || express]
      )
    );
  
    if (test) {
      id = conditionId;
      this.bodyStatement.push(
        getVariableDeclaration(
          id,
          this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.condition),
          [expressId, test]
        )
      );
      this.updateStatement.push(
        getExpressionUpdateStatement(id, test, express, renderListId)
      );
    } else {
      this.updateStatement.push(
        getExpressionUpdateStatement(id, undefined, express, renderListId)
      );
    }
  
    this.mountStatement.push(
      getExpressionStatement(
        memberExpression(id, mountIdentifier),
        [target, anchor].filter(Boolean) as Identifier[]
      )
    );
  
    this.destroyStatement.push(
      getExpressionStatement(memberExpression(id, destroyIdentifier), [])
    );
  
    return id;
  }

  private getTemplateExpression() {
    return objectExpression([
      objectMethod(
        "method",
        mountIdentifier,
        [targetIdentifier, anchorIdentifier],
        blockStatement(this.mountStatement)
      ),
      objectMethod(
        "method",
        updateIdentifier,
        [reactiveIdentifier],
        blockStatement(this.updateStatement)
      ),
      objectMethod(
        "method",
        destroyIdentifier,
        [],
        blockStatement(this.destroyStatement)
      ),
    ]);
  }

  public generate() {
    return callExpression(
      this.rootPath.state.helper.getHelperNameIdentifier(
        RuntimeHelper.markRender
      ),
      [
        arrowFunctionExpression(
          [],
          blockStatement([
            ...this.bodyStatement,
            returnStatement(this.getTemplateExpression()),
          ])
        ),
      ]
    );
  }

  public replace() {
    const functionParent = this.rootPath.getFunctionParent();
    const renderListUpdateExpression =
      // @ts-ignore
      functionParent?.node?.__renderListUpdateExpression;
    if (renderListUpdateExpression) {
      this.updateStatement.unshift(renderListUpdateExpression);
    }

    this.rootPath.replaceWith(this.generate());
  }
}

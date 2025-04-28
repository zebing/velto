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
  ObjectProperty,
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
  isObjectProperty,
  MemberExpression,
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
import {
  getExpressionStatement,
  getVariableDeclaration,
} from "../utils";
import { getExpressionUpdateStatement } from "./util";
import { isEvent } from "@velto/shared";
import { getRenderList } from "../utils";

export interface RenderOption {
  rootPath: NodePath<any>;
}

export default class Template {
  public rootPath: NodePath<any>;
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

  public element(options: {
    elementId: Identifier;
    tag: string;
    props: ObjectExpression;
    target: Identifier | MemberExpression;
    anchor?: Identifier;
  }) {
    const {
      tag,
      elementId,
      props,
      target,
      anchor,
    } = options;

    const properties = props.properties.filter(
      (property) => {
        if (isObjectProperty(property)) {
          const { key = {}, value } = property;
          if (isEvent((key as Identifier)?.name) && (isFunctionExpression(value) || isArrowFunctionExpression(value))) {
            const eventName = this.rootPath.scope.generateUidIdentifier("handle");
            this.bodyStatement.push(
              variableDeclaration(
                'const', 
                [
                  variableDeclarator(
                    eventName, 
                    value
                  ),
                ]
              )
            );
            property.value = eventName;
          }
        }

        return property;
      }
    );

    this.bodyStatement.push(
      getVariableDeclaration(
        elementId,
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.element),
        [stringLiteral(tag), props]
      )
    );

    this.mountStatement.push(
      getExpressionStatement(
        memberExpression(elementId, mountIdentifier),
        [target, anchor].filter(Boolean) as Identifier[]
      )
    );

    if (properties.length) {
      this.updateStatement.push(
        getExpressionStatement(memberExpression(elementId, updateIdentifier), [
          objectExpression(properties),
        ])
      );
    }

    this.destroyStatement.push(
      getExpressionStatement(memberExpression(elementId, destroyIdentifier), [])
    );
  }

  public text(options: {
    str: StringLiteral;
    target: Identifier | MemberExpression;
    anchor?: Identifier;
  }): Identifier {
    const { str, target, anchor } = options;
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
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.append),
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

  public component(options: {
    tag: string;
    props: ObjectExpression;
    target: Identifier | MemberExpression;
    anchor?: Identifier;
  }): Identifier {
    const {
      tag,
      props,
      target = targetIdentifier,
      anchor,
    } = options;
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
        target,
        anchor,
      ].filter(Boolean) as Identifier[])
    );

    this.destroyStatement.push(
      getExpressionStatement(memberExpression(id, destroyIdentifier), [])
    );

    return id;
  }

  public condition(options: {
    express: Expression;
    test: Expression;
    target: Identifier | MemberExpression;
    anchor?: Identifier;
  }): Identifier {
    const {
      express,
      target = targetIdentifier,
      anchor,
      test,
    } = options;
    const expressId = this.rootPath.scope.generateUidIdentifier("express");

    this.bodyStatement.push(
      getVariableDeclaration(
        expressId,
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.expression),
        [express]
      )
    );
    const id = this.rootPath.scope.generateUidIdentifier("condition");

    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.condition),
        [expressId, test]
      )
    );

    this.mountStatement.push(
      getExpressionStatement(
        memberExpression(id, mountIdentifier),
        [target, anchor].filter(Boolean) as Identifier[]
      )
    );

    this.updateStatement.push(
      getExpressionStatement(
        memberExpression(id, updateIdentifier),
        [test, express],
      )
    );

    this.destroyStatement.push(
      getExpressionStatement(memberExpression(id, destroyIdentifier), [])
    );

    return id;
  }

  public expression(options: {
    express: Expression;
    target: Identifier | MemberExpression;
    anchor?: Identifier;
  }): Identifier {
    const {
      express,
      target = targetIdentifier,
      anchor,
    } = options;
    const id = this.rootPath.scope.generateUidIdentifier("express");

    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.expression),
        [express]
      )
    );

    this.mountStatement.push(
      getExpressionStatement(
        memberExpression(id, mountIdentifier),
        [target, anchor].filter(Boolean) as Identifier[]
      )
    );

    this.updateStatement.push(
      getExpressionStatement(
        memberExpression(id, updateIdentifier),
        [express],
      )
    );

    this.destroyStatement.push(
      getExpressionStatement(memberExpression(id, destroyIdentifier), [])
    );

    return id;
  }

  public renderList(options: {
    express: Expression;
    target: Identifier | MemberExpression;
    anchor?: Identifier;
  }): Identifier {
    const {
      express,
      target = targetIdentifier,
      anchor,
    } = options;
    const id = this.rootPath.scope.generateUidIdentifier("renderList");
    this.bodyStatement.push(
      variableDeclaration("const", [
        variableDeclarator(id, express),
      ])
    );

    this.mountStatement.push(
      getExpressionStatement(
        memberExpression(id, mountIdentifier),
        [target, anchor].filter(Boolean) as Identifier[]
      )
    );

    this.updateStatement.push(
      getExpressionStatement(
        memberExpression(id, updateIdentifier),
        [(express as CallExpression).arguments[0] as Expression],
      )
    );

    this.destroyStatement.push(
      getExpressionStatement(memberExpression(id, destroyIdentifier), [])
    );

    return id;
  }

  // public expression(options: {
  //   express: Expression;
  //   target: Identifier | MemberExpression;
  //   anchor?: Identifier;
  //   test?: Expression;
  // }): Identifier {
  //   const {
  //     express,
  //     target = targetIdentifier,
  //     anchor,
  //     test,
  //   } = options;
  //   const expressId = this.rootPath.scope.generateUidIdentifier("express");
  //   const conditionId = this.rootPath.scope.generateUidIdentifier("condition");
  //   let renderListId: Identifier | undefined;
  //   let id = expressId;

  //   const renderListExpression = getRenderList(express, this.rootPath);
  //   if (renderListExpression) {
  //     renderListId = this.rootPath.scope.generateUidIdentifier("renderList");
  //     this.bodyStatement.push(
  //       variableDeclaration("const", [
  //         variableDeclarator(renderListId, renderListExpression),
  //       ])
  //     );
  //   }

  //   this.bodyStatement.push(
  //     getVariableDeclaration(
  //       id,
  //       this.pathState.helper.getHelperNameIdentifier(RuntimeHelper.expression),
  //       [renderListId || express]
  //     )
  //   );

  //   if (test) {
  //     id = conditionId;
  //     this.bodyStatement.push(
  //       getVariableDeclaration(
  //         id,
  //         this.pathState.helper.getHelperNameIdentifier(
  //           RuntimeHelper.condition
  //         ),
  //         [expressId, test]
  //       )
  //     );
  //     this.updateStatement.push(
  //       getExpressionUpdateStatement(id, test, express, renderListId)
  //     );
  //   } else {
  //     this.updateStatement.push(
  //       getExpressionUpdateStatement(id, undefined, express, renderListId)
  //     );
  //   }

  //   this.mountStatement.push(
  //     getExpressionStatement(
  //       memberExpression(id, mountIdentifier),
  //       [target, anchor].filter(Boolean) as Identifier[]
  //     )
  //   );

  //   this.destroyStatement.push(
  //     getExpressionStatement(memberExpression(id, destroyIdentifier), [])
  //   );

  //   return id;
  // }

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
        [],
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

  public generate(): CallExpression {
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
    // @ts-ignore
    this.rootPath.replaceWith(this.generate());
  }
}

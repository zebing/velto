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
  ObjectExpression,
  arrowFunctionExpression,
  CallExpression,
  variableDeclaration,
  variableDeclarator,
  MemberExpression,
} from "@babel/types";
import {
  targetIdentifier,
  anchorIdentifier,
  mountIdentifier,
  updateIdentifier,
  destroyIdentifier,
} from "../constants";
import { RuntimeHelper } from "../helper";
import {
  getExpressionStatement,
  getVariableDeclaration,
} from "../utils";
import { Helper } from "../helper";

export default class Template {
  private bodyStatement: Statement[] = [];
  private mountStatement: Statement[] = [];
  private updateStatement: Statement[] = [];
  private destroyStatement: Statement[] = [];

  constructor(public helper: Helper) {}

  public hoistHandle(expression: Expression): Identifier {
    const id = this.helper.rootPath.scope.generateUidIdentifier("handle");
    this.bodyStatement.push(
      variableDeclaration(
        'const', 
        [
          variableDeclarator(
            id,
            expression,
          ),
        ]
      )
    );

    return id
  }

  public element(options: {
    tag: string;
    props: ObjectExpression;
    target: Identifier | MemberExpression;
    anchor?: Identifier;
  }): Identifier {
    const {
      tag,
      props,
      target,
      anchor,
    } = options;
    const id = this.helper.rootPath.scope.generateUidIdentifier("_element");

    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.helper.getHelperNameIdentifier(RuntimeHelper.element),
        [stringLiteral(tag), props]
      )
    );

    this.mountStatement.push(
      getExpressionStatement(
        memberExpression(id, mountIdentifier),
        [target, anchor].filter(Boolean) as Identifier[]
      )
    );

    if (props.properties.length) {
      this.updateStatement.push(
        getExpressionStatement(memberExpression(id, updateIdentifier), [
          objectExpression(props.properties),
        ])
      );
    }

    this.destroyStatement.push(
      getExpressionStatement(memberExpression(id, destroyIdentifier), [])
    );

    return id;
  }

  public text(options: {
    str: StringLiteral;
    target: Identifier | MemberExpression;
    anchor?: Identifier;
  }): Identifier {
    const { str, target, anchor } = options;
    const id = this.helper.rootPath.scope.generateUidIdentifier("text");

    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.helper.getHelperNameIdentifier(RuntimeHelper.text),
        [str]
      )
    );

    this.mountStatement.push(
      getExpressionStatement(
        this.helper.getHelperNameIdentifier(RuntimeHelper.append),
        [target, id, anchor].filter(Boolean) as Identifier[]
      )
    );

    this.destroyStatement.push(
      getExpressionStatement(
        this.helper.getHelperNameIdentifier(RuntimeHelper.remove),
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
    const id = this.helper.rootPath.scope.generateUidIdentifier("_component");
    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.helper.getHelperNameIdentifier(RuntimeHelper.component),
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
    const expressId = this.helper.rootPath.scope.generateUidIdentifier("express");

    this.bodyStatement.push(
      getVariableDeclaration(
        expressId,
        this.helper.getHelperNameIdentifier(RuntimeHelper.expression),
        [express]
      )
    );
    const id = this.helper.rootPath.scope.generateUidIdentifier("condition");

    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.helper.getHelperNameIdentifier(RuntimeHelper.condition),
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
    const id = this.helper.rootPath.scope.generateUidIdentifier("express");

    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.helper.getHelperNameIdentifier(RuntimeHelper.expression),
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
    const id = this.helper.rootPath.scope.generateUidIdentifier("renderList");
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
      this.helper.getHelperNameIdentifier(
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
}

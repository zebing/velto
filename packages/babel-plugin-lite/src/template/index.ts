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
        this.pathState.helper.getHelperNameIdentifier(
          RuntimeHelper.text
        ),
        [stringLiteral(" ")],
      ),
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
        [stringLiteral(tag)],
      ),
    );

    const elementId = this.rootPath.scope.generateUidIdentifier("_element");

    this.bodyStatement.push(
      getVariableDeclaration(
        elementId,
        this.pathState.helper.getHelperNameIdentifier(
          RuntimeHelper.element
        ),
        [
          id,
          props,
          this.pathState.helper.getHelperNameIdentifier(type),
        ],
      ),
    );

    this.mountStatement.push(
      getExpressionStatement(
        memberExpression(elementId, mountIdentifier),
        [target, anchor].filter(Boolean) as Identifier[]
      )
    );

    this.updateStatement.push(
      getExpressionStatement(
        memberExpression(elementId, updateIdentifier),
        [props],
      )
    );

    this.destroyStatement.push(
      getExpressionStatement(
        memberExpression(elementId, destroyIdentifier),
        [],
      )
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
        this.pathState.helper.getHelperNameIdentifier(
          RuntimeHelper.text
        ),
        [str],
      ),
    );

    this.mountStatement.push(
      getExpressionStatement(
        this.pathState.helper.getHelperNameIdentifier(type),
        [target, id, anchor].filter(Boolean) as Identifier[]
      )
    );

    this.destroyStatement.push(
      getExpressionStatement(
        this.pathState.helper.getHelperNameIdentifier(
          RuntimeHelper.remove
        ),
        [id],
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
        this.pathState.helper.getHelperNameIdentifier(
          RuntimeHelper.component
        ),
        [identifier(tag), props],
      ),
    );

    this.mountStatement.push(
      getExpressionStatement(memberExpression(id, mountIdentifier), [
        targetIdentifier,
        anchorIdentifier,
      ])
    );

    this.destroyStatement.push(
      getExpressionStatement(
        memberExpression(id, destroyIdentifier),
        [],
      )
    );

    return id;
  }

  public expression(options: {
    express: Expression;
    target: Identifier;
    anchor?: Identifier;
    test?: Expression;
  }) {
    let {
      express,
      target = targetIdentifier,
      anchor = anchorIdentifier,
      test,
    } = options;
    const expressId = this.rootPath.scope.generateUidIdentifier("express");
    const conditionId = this.rootPath.scope.generateUidIdentifier("condition");
    let renderListId;
    let id = expressId;
    const renderListExpression = this.renderList(express);

    if (renderListExpression) {
    renderListId = this.rootPath.scope.generateUidIdentifier("renderList");

      this.bodyStatement.push(
        variableDeclaration(
          'const', 
          [
            variableDeclarator(
              renderListId, 
              renderListExpression
            ),
          ]
        )
      );
    }
    
    this.bodyStatement.push(
      getVariableDeclaration(
        id,
        this.pathState.helper.getHelperNameIdentifier(
          RuntimeHelper.expression
        ),
        [renderListId || express],
      ),
    );

    if (test) {
      id = conditionId;
      this.bodyStatement.push(
        getVariableDeclaration(
          id,
          this.pathState.helper.getHelperNameIdentifier(
            RuntimeHelper.condition
          ),
          [expressId, test],
        ),
      );
      this.updateStatement.push(
        getExpressionStatement(
          memberExpression(id, updateIdentifier),
          renderListId ? [test] : [test, express],
        )
      );
    } else {
      this.updateStatement.push(
        getExpressionStatement(
          memberExpression(id, updateIdentifier),
          renderListId ? [] : [express],
        )
      );
    }

    this.mountStatement.push(
      getExpressionStatement(
        memberExpression(id, mountIdentifier),
        [target, anchor].filter(Boolean) as Identifier[]
      )
    );

    this.destroyStatement.push(
      getExpressionStatement(
        memberExpression(id, destroyIdentifier),
        [],
      )
    );

    return id;
  }

  private renderList(express: Node) {
    if (isCallExpression(express)) {
      const callee = express.callee;
      const [argument] = express.arguments;

      if (
        (isMemberExpression(callee) && 
        (callee.property as Identifier)?.name === "map") && 
        (isArrowFunctionExpression(argument) || isFunctionExpression(argument))
      ) {
        const body = argument.body || {};
        let isJSX = false;
        if (isBlockStatement(body)) {
          const blockStatementBody = body.body;
          const returnStatement = blockStatementBody.find(arg => isReturnStatement(arg));
  
          if (returnStatement) {
            const returnStatementArgument = (returnStatement as ReturnStatement).argument;
  
            if (isJSXElement(returnStatementArgument) || isJSXFragment(returnStatementArgument)) {
              isJSX = true;
            }
          }
        } else if (isJSXElement(body) || isJSXFragment(body)){
          isJSX = true;
        }

        if (isJSX) {
          return callExpression(
            this.rootPath.state.helper.getHelperNameIdentifier(RuntimeHelper.renderList),
            [
              callee.object,
              argument,
            ]
          );
        }
      }
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

    // if (this.rootPath.isJSXElement() || this.rootPath.isJSXFragment()) {
    //   this.renderList(this.rootPath as NodePath<JSXElement | JSXFragment>);
    // }

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
}

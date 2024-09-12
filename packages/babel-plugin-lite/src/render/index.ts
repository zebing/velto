import { Identifier, identifier, blockStatement, Statement, returnStatement, 
  objectExpression, objectMethod, functionExpression, variableDeclaration, 
  variableDeclarator, callExpression, stringLiteral, expressionStatement, 
  importDeclaration, importSpecifier, ImportDeclaration, ImportSpecifier, 
  Expression, StringLiteral, memberExpression, MemberExpression, ObjectExpression, 
  ifStatement, arrayExpression, arrowFunctionExpression, logicalExpression,
  assignmentExpression, nullLiteral, objectProperty, booleanLiteral, forInStatement } from "@babel/types"
import { NodePath } from "@babel/traverse";
import { targetIdentifier, anchorIdentifier, reactiveIdentifier, isJSX } from "../constants";
import { HelperNameType } from "../helper";
import { NodePathState } from "../types";
export interface RenderOption {
  rootPath: NodePath;
}

export default class Render {
  public rootPath: NodePath;
  private pathState: NodePathState;
  private renderName: Identifier;
  private renderStatement: Statement[] = [];
  private mounteStatement: Statement[] = [];
  private updateStatement: Statement[] = [];
  private destroyStatement: Statement[] = [];

  constructor(options: RenderOption) {
    const { rootPath } = options || {};
    this.rootPath = rootPath;
    this.pathState = rootPath.state as NodePathState;
    this.renderName = identifier('render');
  }

  // public space(target: Identifier) {
  //   const id = this.rootPath.scope.generateUidIdentifier('spaceAnchor');
  //   this.pushRenderStatement({
  //     id,
  //     callee: this.pathState.helper.getHelperNameIdentifier(HelperNameType.text),
  //     argumentList: [
  //       stringLiteral(' '),
  //     ],
  //   });
  //   this.pushMounteStatement({
  //     callee: this.pathState.helper.getHelperNameIdentifier(HelperNameType.append),
  //     id,
  //     target,
  //   });
  //   return id;
  // }

  public attr(options: {
    target: Identifier;
    name: string;
    value: Expression;
    reactiveList: Identifier[],
  }) {
    const { target, name, value, reactiveList } = options;
    let callee: Expression;
    let argumentList: Expression[] = [];

    if (name === 'style') {
      callee = this.pathState.helper.getHelperNameIdentifier(HelperNameType.style),
      argumentList = [target, value];

    } else if (name === 'class') {
      callee = this.pathState.helper.getHelperNameIdentifier(HelperNameType.classe),
      argumentList = [target, value];

    } else if (/^on[^a-z]/.test(name)) {
      callee = this.pathState.helper.getHelperNameIdentifier(HelperNameType.event),
      argumentList = [target, stringLiteral(name), value];

    } else {
      callee = this.pathState.helper.getHelperNameIdentifier(HelperNameType.attr),
      argumentList = [target, stringLiteral(name), value];
    }

    this.pushMounteStatement({
      callee,
      argumentList,
    });

    if (reactiveList.length) {
      this.pushUpdateStatement({
        reactiveList,
        callee,
        argumentList,
        id: identifier(name),
        express: nullLiteral(),
      });
    }
  }

  public spreadAttr(options: {
    target: Identifier;
    express: Expression;
    reactiveList: Identifier[];
  }) {
    const { target, express, reactiveList } = options;
    const callee = this.pathState.helper.getHelperNameIdentifier(HelperNameType.attr)
    const id = identifier('key');
    const node = forInStatement(
      variableDeclaration('const', [
        variableDeclarator(id)
      ]),
      express,
      blockStatement([
        expressionStatement(
          callExpression(callee, [
            target,
            id,
            memberExpression(express, id, true)
          ])
        ),
      ]),
    )
    this.mounteStatement.push(node);

    if (reactiveList.length) {
      const ifStatementNode = ifStatement(
        callExpression(
          memberExpression(
            arrayExpression(reactiveList),
            identifier('includes'),
          ),
          [reactiveIdentifier]
        ),
        
        node,
      );
  
      this.updateStatement.push(ifStatementNode);
    }
  }

  public element(options: {
    tag: string;
    type: HelperNameType;
    target: Identifier;
    anchor?: Identifier;
  }) {
    const {
      tag,
      type = HelperNameType.insert,
      target,
      anchor,
    } = options;
    const id = this.rootPath.scope.generateUidIdentifier(tag);

    this.pushRenderStatement({
      id,
      callee: this.pathState.helper.getHelperNameIdentifier(HelperNameType.element),
      argumentList: [stringLiteral(tag)],
    });
    
    this.pushMounteStatement({ 
      argumentList: [target, id, anchor].filter(Boolean) as Identifier[],
      callee: this.pathState.helper.getHelperNameIdentifier(type),
    });
    
    if (type === 'insert') {
      this.pushDestroyStatement({
        callee: this.pathState.helper.getHelperNameIdentifier(HelperNameType.remove),
        argumentList: [id],
      });
    }

    return id;
  }

  public text(options: {
    str: StringLiteral,
    type: HelperNameType.insert | HelperNameType.append,
    target: Identifier,
    anchor?: Identifier,
  }) {
    const { str, type, target, anchor } = options;
    const id = this.rootPath.scope.generateUidIdentifier('text');
    this.pushRenderStatement({
      id,
      callee: this.pathState.helper.getHelperNameIdentifier(HelperNameType.text),
      argumentList: [str],
    });
    
    this.pushMounteStatement({ 
      argumentList: [target, id, anchor].filter(Boolean) as Identifier[],
      callee: this.pathState.helper.getHelperNameIdentifier(type),
    });
    
    if (type === 'insert') {
      this.pushDestroyStatement({
        callee: this.pathState.helper.getHelperNameIdentifier(HelperNameType.remove),
        argumentList: [id]
      });
    }
    
    return id;
  }

  public component(tag: string, props: ObjectExpression) {
    const id = this.rootPath.scope.generateUidIdentifier('component');
    this.pushRenderStatement({
      id,
      callee: this.pathState.helper.getHelperNameIdentifier(HelperNameType.buildComponent),
      argumentList: [identifier(tag), props],
    });

    this.pushMounteStatement({
      callee: memberExpression(id, identifier('mount')),
      argumentList: [targetIdentifier, anchorIdentifier],
    });

    this.pushUpdateStatement({
      reactiveList: [],
      callee: memberExpression(id, identifier('update')),
      id,
      express: nullLiteral(),
    });

    this.pushDestroyStatement({
      callee: memberExpression(id, identifier('destroy')),
      argumentList: [],
    });

    return id;
  }

  // public expression(options: {
  //   express: Expression,
  //   target?: Identifier,
  //   anchor?: Identifier,
  //   reactiveList?: Identifier[],
  //   test?: Expression; // if (test) expression()
  // }) {
  //   const { express, target = targetIdentifier, anchor = anchorIdentifier, reactiveList = [], test } = options;
  //   const id = this.rootPath.scope.generateUidIdentifier('express');

  //   this.pushRenderStatement({
  //     id,
  //     callee: this.pathState.helper.getHelperNameIdentifier(HelperNameType.expression),
  //     argumentList: [
  //       arrowFunctionExpression([], express),
  //     ],
  //     test,
  //   });
    
  //   this.pushMounteStatement({
  //     argumentList: [target, anchor],
  //     callee: memberExpression(id, identifier('mount')),
  //     test,
  //   });

  //   if (reactiveList.length) {
  //     this.pushUpdateStatement({
  //       reactiveList,
  //       callee: memberExpression(id, identifier('update')),
  //       test,
  //       id,
  //       express,
  //       target,
  //       anchor
  //     });
  //   }

  //   this.pushDestroyStatement({
  //     callee: memberExpression(id, identifier('destroy')),
  //     test,
  //   });

  //   return id;
  // }

  // callee(id)
  // callee()
  public pushUpdateStatement(options: {
    target?: Identifier,
    anchor?: Identifier,
    id: Identifier;
    callee: Expression;
    reactiveList: Identifier[];
    argumentList?: Expression[];
    test?: Expression;
    express: Expression;
  }) {
    const { callee, reactiveList, argumentList, test, express, id, target, anchor } = options;
    let statementNode = blockStatement(
      [
        expressionStatement(
          callExpression(
            callee,
            argumentList || [reactiveIdentifier],
          ),
        )
      ]
    );

    if (test) {
      statementNode = blockStatement([
        ifStatement(
          test, 
          blockStatement([
            ifStatement(
              id,
              statementNode,
              blockStatement([
                expressionStatement(
                  // id = expression(() => express)
                  assignmentExpression(
                    '=',
                    id,
                    callExpression(
                      this.pathState.helper.getHelperNameIdentifier(HelperNameType.expression),
                      [
                        arrowFunctionExpression([], express),
                      ],
                    ),
                  ),
                ),
                expressionStatement(
                  callExpression(
                    memberExpression(id, identifier('mount')),
                    [target!, anchor!],
                  ),
                )
              ]),
            )
          ]),
          blockStatement([
            ifStatement(
              id, 
              expressionStatement(
                callExpression(
                  memberExpression(id, identifier('destroy')),
                  [],
                ),
              ),
            ),
            expressionStatement(
              assignmentExpression(
                '=',
                id,
                nullLiteral(),
              ),
            ),
          ]),
        )
      ]);
    }

    const ifStatementNode = ifStatement(
      callExpression(
        memberExpression(
          arrayExpression(reactiveList),
          identifier('includes'),
        ),
        [reactiveIdentifier]
      ),
      
      statementNode,
    );

    this.updateStatement.push(
      reactiveList.length ? ifStatementNode : statementNode,
    );
  }

  // callee(id)
  // callee()
  public pushRenderStatement(options: {
    kind?: "var" | "let" | "const",
    callee: Expression;
    id: Identifier;
    argumentList: Expression[];
    test?: Expression;
  }) {
    const { id, callee, argumentList, kind = 'const', test } = options;
    const express = callExpression(callee, argumentList);
  
    const init = test ? logicalExpression('&&', test, express) : express;
    this.renderStatement.push(
      variableDeclaration(
        test ? 'let' : kind,
        [variableDeclarator(id, init)]
      )
    );
  }

  // callee(target, id, anchor)
  // callee(target, anchor)
  public pushMounteStatement(options: {
    callee: Expression;
    argumentList: Expression[];
    test?: Expression; // if (test) {expression}
  }) {
    const { callee, argumentList, test } = options;

    const expression = expressionStatement(
      callExpression(
        callee,
        argumentList,
      )
    );

    this.mounteStatement.push(
      test ? ifStatement(test, expression) : expression,
    );
  }

  // callee(id)
  // callee()
  public pushDestroyStatement(options: {
    callee: Expression;
    argumentList: Expression[];
    test?: Expression;
  }) {
    const { callee, argumentList, test } = options;

    const expression = expressionStatement(
      callExpression(
        callee,
        argumentList,
      )
    )

    this.destroyStatement.push(
      test ? ifStatement(test, expression) : expression,
    );
  }

  public generate() {
    const statementPath = this.rootPath.getStatementParent();
    statementPath?.insertBefore(this.renderStatement);

    const isJSX = this.pathState.helper.getHelperNameIdentifier(HelperNameType.isJSX);
    return objectExpression([
      objectProperty(isJSX, booleanLiteral(true), true),
      objectMethod('method', identifier('mount'), [identifier('target'), identifier('anchor')], blockStatement(this.mounteStatement)),
      objectMethod('method', identifier('update'), [identifier('reactive')], blockStatement(this.updateStatement)),
      objectMethod('method', identifier('destroy'), [], blockStatement(this.destroyStatement)),
    ]);
  }
}
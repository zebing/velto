import { Identifier, identifier, blockStatement, Statement, returnStatement, 
  objectExpression, objectMethod, functionExpression, variableDeclaration, 
  variableDeclarator, callExpression, stringLiteral, expressionStatement, 
  importDeclaration, importSpecifier, ImportDeclaration, ImportSpecifier, 
  Expression, StringLiteral, memberExpression, MemberExpression, ObjectExpression, 
  ifStatement, arrayExpression, arrowFunctionExpression, logicalExpression,
  assignmentExpression, nullLiteral } from "@babel/types"
import { NodePath } from "@babel/traverse";
import { State } from "../types";
import { CallExpressionName } from "./helperName";
import { StateName, targetIdentifier, anchorIdentifier, refIdentifier } from "../constants";

export * from "./helperName";
export interface RenderOption {
  nodePath: NodePath;
  state: State;
}

export default class Render {
  private nodePath: NodePath;
  private pathState: State;
  private renderName: Identifier;
  public callExpressionNameMap = {} as Record<CallExpressionName, Identifier>;
  private renderStatement: Statement[] = [];
  private mounteStatement: Statement[] = [];
  private updateStatement: Statement[] = [];
  private destroyStatement: Statement[] = [];

  constructor(options: RenderOption) {
    const { nodePath, state } = options || {};
    this.nodePath = nodePath;
    this.pathState = state;
    this.renderName = identifier('render');

    this.initHelperName();
  }

  private initHelperName() {
    const importHelperState = this.pathState.get<ImportDeclaration>(StateName.importHelper);
    if (importHelperState) {
      (importHelperState.specifiers as ImportSpecifier[]).forEach((specifier) => {
        this.callExpressionNameMap[(specifier.imported as Identifier).name as CallExpressionName] = specifier.local;
      });

      return;
    }

    const importHelper = importDeclaration(
      (Object.keys(CallExpressionName) as CallExpressionName[]).map((key: CallExpressionName) => {
        const localName = this.nodePath.scope.generateUidIdentifier(key);
        this.callExpressionNameMap[key] = localName;
        return importSpecifier(localName, identifier(key));
      }),
      stringLiteral(CallExpressionName.source),
    );

    this.pathState.set<ImportDeclaration>(StateName.importHelper, importHelper);
  }

  public hoist(express: Expression) {
    const rootPath = this.pathState.get(StateName.jsxRootPath);
    const id = rootPath.scope.generateUidIdentifier('hoist_render');
    const el = variableDeclaration(
      "const",
      [
        variableDeclarator(
          id,
          express,
        )
      ]
    );
    rootPath?.insertBefore(el);
    return id;
  }

  public space(target: Identifier) {
    const id = this.nodePath.scope.generateUidIdentifier('spaceAnchor');
    this.pushRenderStatement({
      id,
      callee: this.callExpressionNameMap[CallExpressionName.text],
      argumentList: [
        stringLiteral(' '),
      ],
    });
    this.pushMounteStatement({
      callee: this.callExpressionNameMap[CallExpressionName.append],
      id,
      target,
    });
    return id;
  }

  public attr(options: {
    target: Identifier;
    name: string;
    value: Expression;
    refList: Identifier[],
  }) {
    const { target, name, value, refList } = options;
    let callee: Expression;
    let argumentList: Expression[] = [];

    if (name === 'style') {
      callee = this.callExpressionNameMap[CallExpressionName.style];
      argumentList = [target, value];

    } else if (name === 'class') {
      callee = this.callExpressionNameMap[CallExpressionName.classe];
      argumentList = [target, value];

    } else if (/^on[^a-z]/.test(name)) {
      callee = this.callExpressionNameMap[CallExpressionName.event];
      argumentList = [target, stringLiteral(name), value];

    } else {
      callee = this.callExpressionNameMap[CallExpressionName.attr];
      argumentList = [target, stringLiteral(name), value];
    }

    this.pushMounteStatement({
      callee,
      argumentList,
    });

    if (refList.length) {
      this.pushUpdateStatement({
        refList,
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
  }) {
    const { target, express } = options;

    this.pushMounteStatement({
      callee: this.callExpressionNameMap[CallExpressionName.spreadAttr],
      argumentList: [target, express],
    });
  }

  public element(options: {
    tag: string;
    type: 'insert' | 'append';
    target?: Identifier;
    anchor?: Identifier;
  }) {
    const {
      tag,
      type = CallExpressionName.insert,
      target = targetIdentifier,
      anchor,
    } = options;
    const id = this.nodePath.scope.generateUidIdentifier(tag);

    this.pushRenderStatement({
      id,
      callee: this.callExpressionNameMap[CallExpressionName.element],
      argumentList: [stringLiteral(tag)],
    });
    
    this.pushMounteStatement({ 
      id, target, anchor,
      callee: this.callExpressionNameMap[type],
    });
    
    if (type === 'insert') {
      this.pushDestroyStatement({
        callee: this.callExpressionNameMap[CallExpressionName.remove],
        id,
      });
    }

    return id;
  }

  public text(options: {
    str: StringLiteral,
    type: 'insert' | 'append',
    target?: Identifier,
    anchor?: Identifier,
  }) {
    const {
      str,
      type = CallExpressionName.insert,
      target = targetIdentifier,
      anchor,
    } = options;
    const id = this.nodePath.scope.generateUidIdentifier('text');
    this.pushRenderStatement({
      id,
      callee: this.callExpressionNameMap[CallExpressionName.text],
      argumentList: [str],
    });
    
    this.pushMounteStatement({ 
      id, target, anchor,
      callee: this.callExpressionNameMap[type],
    });
    
    if (type === 'insert') {
      this.pushDestroyStatement({
        callee: this.callExpressionNameMap[CallExpressionName.remove],
        id,
      });
    }
    
    return id;
  }

  public component(tag: string, props: ObjectExpression) {
    const id = this.nodePath.scope.generateUidIdentifier('component');
    this.pushRenderStatement({
      id,
      callee: this.callExpressionNameMap[CallExpressionName.buildComponent],
      argumentList: [identifier(tag), props],
    });

    this.pushMounteStatement({
      callee: memberExpression(id, identifier('mount')),
      argumentList: [targetIdentifier, anchorIdentifier],
    });

    this.pushUpdateStatement({
      refList: [],
      callee: memberExpression(id, identifier('update')),
      id,
      express: nullLiteral(),
    });

    this.pushDestroyStatement({
      callee: memberExpression(id, identifier('destroy')),
    });

    return id;
  }

  public expression(options: {
    express: Expression,
    target?: Identifier,
    anchor?: Identifier,
    refList?: Identifier[],
    test?: Expression; // if (test) expression()
  }) {
    const { express, target = targetIdentifier, anchor = anchorIdentifier, refList = [], test } = options;
    const id = this.nodePath.scope.generateUidIdentifier('express');

    this.pushRenderStatement({
      id,
      callee: this.callExpressionNameMap[CallExpressionName.expression],
      argumentList: [
        arrowFunctionExpression([], express),
      ],
      test,
    });
    
    this.pushMounteStatement({
      argumentList: [target, anchor],
      callee: memberExpression(id, identifier('mount')),
      test,
    });

    if (refList.length) {
      this.pushUpdateStatement({
        refList,
        callee: memberExpression(id, identifier('update')),
        test,
        id,
        express,
        target,
        anchor
      });
    }

    this.pushDestroyStatement({
      callee: memberExpression(id, identifier('destroy')),
      test,
    });

    return id;
  }

  // callee(id)
  // callee()
  public pushUpdateStatement(options: {
    target?: Identifier,
    anchor?: Identifier,
    id: Identifier;
    callee: Expression;
    refList: Identifier[];
    argumentList?: Expression[];
    test?: Expression;
    express: Expression;
  }) {
    const { callee, refList, argumentList, test, express, id, target, anchor } = options;
    let statementNode = blockStatement(
      [
        expressionStatement(
          callExpression(
            callee,
            argumentList || [refIdentifier],
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
                      this.callExpressionNameMap[CallExpressionName.expression],
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
            expressionStatement(
              callExpression(
                memberExpression(id, identifier('destroy')),
                [],
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
          arrayExpression(refList),
          identifier('includes'),
        ),
        [refIdentifier]
      ),
      
      statementNode,
    );

    this.updateStatement.push(
      refList.length ? ifStatementNode : statementNode,
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
    let init: Expression = callExpression(
      callee,
      argumentList,
    );

    if (test) {
      init = logicalExpression(
        '&&',
        test,
        init,
      )
    }

    this.renderStatement.push(
      variableDeclaration(
        test ? 'let' : kind,
        [
          variableDeclarator(
            id,
            init,
          )
        ]
      )
    );
  }

  // callee(target, id, anchor)
  // callee(target, anchor)
  public pushMounteStatement(options: {
    callee: Expression;
    target?: Identifier, // 跟 argumentList 互斥
    id?: Identifier, // 跟 argumentList 互斥
    anchor?: Identifier, // 跟 argumentList 互斥
    argumentList?: Expression[];
    test?: Expression; // if (test) {expression}
  }) {
    const { id,  target, anchor, callee, argumentList, test } = options;
    const defaultArgumentList: Identifier[] = [];
    if (target) {
      defaultArgumentList.push(target);
    }

    if (id) {
      defaultArgumentList.push(id);
    }

    if (anchor) {
      defaultArgumentList.push(anchor);
    }

    const expression = expressionStatement(
      callExpression(
        callee,
        argumentList || defaultArgumentList,
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
    id?: Identifier;
    argumentList?: Expression[];
    test?: Expression;
  }) {
    const { id, callee, argumentList, test } = options;
    const defaultArgumentList: Identifier[] = [];

    if (id) {
      defaultArgumentList.push(id);
    }

    const expression = expressionStatement(
      callExpression(
        callee,
        argumentList || defaultArgumentList,
      )
    )

    this.destroyStatement.push(
      test ? ifStatement(test, expression) : expression,
    );
  }

  public generateFunctionDeclaration() {
    return functionExpression(this.renderName, [], blockStatement([
      ...this.renderStatement,
      returnStatement(
        objectExpression([
          objectMethod(
            'method', 
            identifier('mount'), 
            [
              targetIdentifier,
              anchorIdentifier,
            ], 
            blockStatement(this.mounteStatement)
          ),
          objectMethod(
            'method', 
            identifier('update'), 
            [
              refIdentifier,
            ], 
            blockStatement(this.updateStatement)
          ),
          objectMethod(
            'method', 
            identifier('destroy'), 
            [], 
            blockStatement(this.destroyStatement)
          ),
        ])
      )
    ]))
  }
}
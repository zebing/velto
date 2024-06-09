import { Identifier, identifier, blockStatement, Statement, returnStatement, 
  objectExpression, objectMethod, functionExpression, variableDeclaration, 
  variableDeclarator, callExpression, stringLiteral, expressionStatement, 
  importDeclaration, importSpecifier, ImportDeclaration, ImportSpecifier, 
  Expression, StringLiteral, memberExpression, CallExpression, ObjectExpression, 
  ifStatement, arrayExpression, arrowFunctionExpression } from "@babel/types"
import { NodePath } from "@babel/traverse";
import { State } from "../types";
import CallExpressionName from "./helperName";
import { StateName, targetIdentifier, anchorIdentifier, refIdentifier } from "../constants";

export interface RenderOption {
  nodePath: NodePath;
  state: State;
}

export default class Render {
  private nodePath: NodePath;
  private pathState: State;
  private renderName: Identifier;
  private callExpressionNameMap = {} as Record<CallExpressionName, Identifier>;
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
      callee: memberExpression(id, identifier('mount')),
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
  }) {
    const { express, target = targetIdentifier, anchor, refList = [] } = options;
    debugger
    const id = this.nodePath.scope.generateUidIdentifier('express');
    this.pushRenderStatement({
      id,
      callee: this.callExpressionNameMap[CallExpressionName.expression],
      argumentList: [
        arrowFunctionExpression([], express),
      ],
    });
    
    this.pushMounteStatement({
      argumentList: [target, anchorIdentifier],
      callee: memberExpression(id, identifier('mount')),
    });

    if (refList.length) {
      this.pushUpdateStatement({
        refList,
        callee: memberExpression(id, identifier('update')),
      });
    }

    this.pushDestroyStatement({
      callee: memberExpression(id, identifier('destroy')),
    });

    return id;
  }

  // callee(id)
  // callee()
  public pushUpdateStatement(options: {
    callee: Expression;
    refList: Identifier[];
    argumentList?: Expression[];
  }) {
    const { callee, refList, argumentList } = options;
    const callExpressionNode = expressionStatement(
      callExpression(
        callee,
        argumentList || [refIdentifier],
      ),
    );

    const ifStatementNode = ifStatement(
      callExpression(
        memberExpression(
          arrayExpression(refList),
          identifier('includes'),
        ),
        [refIdentifier]
      ),
      
      callExpressionNode,
    );

    this.updateStatement.push(
      refList.length ? ifStatementNode : callExpressionNode,
    );
  }

  // callee(id)
  // callee()
  public pushRenderStatement(options: {
    callee: Expression;
    id: Identifier;
    argumentList: Expression[];
  }) {
    const { id, callee, argumentList } = options;

    this.renderStatement.push(
      variableDeclaration(
        'const',
        [
          variableDeclarator(
            id,
            callExpression(
              callee,
              argumentList,
            )
          )
        ]
      )
    );
  }

  // callee(target, id, anchor)
  // callee(target, anchor)
  public pushMounteStatement(options: {
    callee: Expression;
    target?: Identifier,
    id?: Identifier,
    anchor?: Identifier,
    argumentList?: Expression[];
  }) {
    const { id,  target, anchor, callee, argumentList } = options;
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

    this.mounteStatement.push(
      expressionStatement(
        callExpression(
          callee,
          argumentList || defaultArgumentList,
        )
      )
    );
  }

    // callee(id)
  // callee()
  public pushDestroyStatement(options: {
    callee: Expression;
    id?: Identifier;
    argumentList?: Expression[];
  }) {
    const { id, callee, argumentList } = options;
    const defaultArgumentList: Identifier[] = [];

    if (id) {
      defaultArgumentList.push(id);
    }

    this.destroyStatement.push(
      expressionStatement(
        callExpression(
          callee,
          argumentList || defaultArgumentList,
        )
      )
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
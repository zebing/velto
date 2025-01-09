import { Program, Identifier, importDeclaration, identifier, stringLiteral, importSpecifier } from "@babel/types";
import { NodePath } from "@babel/traverse";

export enum RuntimeHelper {
  source = '@lite/lite',
  ref = 'ref',
  computed = 'computed',

  // component
  component = 'component',

  // element
  createElement = 'createElement',
  element = 'element',
  text = 'text',
  insert = 'insert',
  remove = 'remove',
  append = 'append',

  expression = 'expression',
  renderList = 'renderList',
  condition = 'condition',
}

export class Helper {
  private rootPath: NodePath<Program>;
  private helperNameIdentifierMap = new Map<RuntimeHelper, Identifier>();
  public helperImportDeclaration = importDeclaration([], stringLiteral(RuntimeHelper.source));

  constructor(options: { rootPath: NodePath<Program> }) {
    const { rootPath } = options;
    this.rootPath = rootPath;
  }

  get hasSpecifier() {
    return !!this.helperImportDeclaration.specifiers.length;
  }

 public getHelperNameIdentifier(name: RuntimeHelper) {
    let value = this.helperNameIdentifierMap.get(name);

    if (!value) {
      value = this.rootPath.scope.generateUidIdentifier(name);
      this.helperNameIdentifierMap.set(name, value);
      this.helperImportDeclaration.specifiers.push(
        importSpecifier(value, identifier(name))
      );
    }

    return value;
  }
}
import { Program, Identifier, importDeclaration, identifier, stringLiteral, importSpecifier } from "@babel/types";
import { NodePath } from "@babel/traverse";

export enum HelperNameType {
  isJSX = 'isJSX', // Symbol('jsx')

  source = '@lite/lite',
  ref = 'ref',
  runtimeRef = 'runtimeRef',
  computed = 'computed',
  runtimeComputed = 'runtimeComputed',

  // component
  component = 'component',

  // element
  createElement = 'createElement',
  element = 'element',
  text = 'text',
  insert = 'insert',
  remove = 'remove',
  append = 'append',

  // attribute
  attr = 'attr',
  spreadAttr = 'spreadAttr',
  event = 'event',
  style = 'style',
  classe = 'classe',

  expression = 'expression',
  renderList = 'renderList',
  condition = 'condition',
}

export class Helper {
  private rootPath: NodePath<Program>;
  private helperNameIdentifierMap = new Map<HelperNameType, Identifier>();
  public helperImportDeclaration = importDeclaration([], stringLiteral(HelperNameType.source));

  constructor(options: { rootPath: NodePath<Program> }) {
    const { rootPath } = options;
    this.rootPath = rootPath;
  }

  get hasSpecifier() {
    return !!this.helperImportDeclaration.specifiers.length;
  }

 public getHelperNameIdentifier(name: HelperNameType) {
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
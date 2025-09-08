import { Identifier, MemberExpression , JSXElement, JSXExpressionContainer, JSXFragment, JSXSpreadChild, JSXText} from '@babel/types';
import { Helper } from '../helper';
import { NodePath } from '@babel/traverse';
import Template from '../template';

export interface NodePathState {
  helper: Helper;
};

export interface TransformJSXOptions<T = any> {
  path: NodePath<T>;
  template: Template;
  target: Identifier | MemberExpression;
  anchor?: Identifier;
};

export interface TransformJSXChildrenOptions<T = any> {
  path: NodePath<T>[];
  template: Template;
  target: Identifier | MemberExpression;
  anchor?: Identifier;
};
import { Identifier, MemberExpression } from '@babel/types';
import { Helper } from '../helper';
import { NodePath } from '@babel/traverse';
import Template from '../template';

export interface NodePathState {
  helper: Helper;
};

export interface NodePathData {
  parentId: Identifier;
  reactiveList: Identifier[];
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
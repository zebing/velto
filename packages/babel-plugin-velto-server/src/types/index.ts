import { Helper } from '../helper';
import { NodePath } from '@babel/traverse';
import TemplateLiteralContext from '../TemplateLiteralContext';

export interface NodePathState {
  helper: Helper;
};

export interface TransformJSXOptions<T = any> {
  path: NodePath<T>;
  context: TemplateLiteralContext;
};

export interface TransformJSXChildrenOptions<T = any> {
  path: NodePath<T>[];
  context: TemplateLiteralContext;
};
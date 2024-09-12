import { Identifier } from '@babel/types';
import { Helper } from '../helper';
import { NodePath } from '@babel/traverse';
import Render from '../render';

export interface NodePathState {
  helper: Helper;
};

export interface NodePathData {
  parentId: Identifier;
  reactiveList: Identifier[];
};

export interface TransformJSXOptions<T = any> {
  path: NodePath<T>;
  render: Render;
  root?: boolean;
};

export interface TransformJSXChildrenOptions<T = any> {
  path: NodePath<T>[];
  render: Render;
};
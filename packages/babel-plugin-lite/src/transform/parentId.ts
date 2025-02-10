import { NodePath } from '@babel/core';
import { Identifier } from '@babel/types';
import { targetIdentifier } from '../constants';
import { NodePathData } from '../types';

export function getParentId(path?: NodePath<any>) {
  let parent: NodePath | undefined | null = path?.parentPath;
  while (parent) {
    const data = parent.data as unknown as NodePathData | undefined;
    const parentId = data?.parentId;
    if (parentId) {
      return parentId;
    }
    parent = parent.parentPath;
  }
  return targetIdentifier;
}

export function setParentId(path: NodePath<any>, id: Identifier = targetIdentifier) {
  path.data ??= {};
  path.data.parentId = id;
}

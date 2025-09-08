import { identifier } from '@babel/types';

export const targetIdentifier = identifier('target');
export const anchorIdentifier = identifier('anchor');
export const reactiveIdentifier = identifier('reactive');
export const mountIdentifier = identifier('mount');
export const hydradeIdentifier = identifier('hydrade');
export const updateIdentifier = identifier('update');
export const destroyIdentifier = identifier("destroy");
export const nodeIdentifier = identifier('node');
export const typeIdentifier = identifier('type');
export const tagIdentifier = identifier('tag');
export const childrenIdentifier = identifier('children');

export enum NodeType {
  component = 1,
  element = 2,
  text = 3,
  expression = 4,
  renderList = 5,
  condition = 6,
}

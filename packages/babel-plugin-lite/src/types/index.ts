import { File } from '@babel/types';
import { StateName } from '../constants';

export type State = {
  get<T = any>(name: StateName): T;
  set<T = any>(name: StateName, value: T): void;
  opts: Record<string, any>;
  file: File;
};
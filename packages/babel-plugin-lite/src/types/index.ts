import { File } from '@babel/types';
import { StateName, HelperName } from '../constants';

export type State = {
  get: (name: StateName | HelperName) => any;
  set: (name: StateName | HelperName, value: any) => any;
  opts: Record<string, any>;
  file: File;
};
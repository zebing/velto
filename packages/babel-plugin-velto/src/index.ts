import SyntaxJSX from '@babel/plugin-syntax-jsx';
import visitor from './visitor';

interface Babel {
  types: typeof import('@babel/types');
}

export interface Options {
  hydrate?: boolean;
}

export default (babel: Babel, options: Options) => {
  return {
    name: 'babel-plugin-velto',
    inherits: SyntaxJSX,
    visitor,
  };
};
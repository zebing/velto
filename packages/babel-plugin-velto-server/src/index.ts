import SyntaxJSX from '@babel/plugin-syntax-jsx';
import visitor from './visitor';

export default () => {
  return {
    name: 'babel-plugin-velto-server',
    inherits: SyntaxJSX,
    visitor,
  };
};
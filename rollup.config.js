import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named'
    },
    {
      file: pkg.module,
      format: 'esm'
    }
  ],
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ],
  external: ['fs', 'path']
};

import resolve from '@rollup/plugin-node-resolve';
import babel from "@rollup/plugin-babel"

export default {
  input: 'src/main.js',
  output: [
    {
      format: 'cjs',
      file: 'dist/bundle.js'
    },
  ],
  plugins: [
    resolve(),
    babel({
        exclude: ["node_modules/**"],
    })
  ],
};
import { copyFileSync, mkdirSync } from 'node:fs';
import * as esbuild from 'esbuild';
import postcss from 'postcss';
import postcssConfig from './postcss.config.mjs';

const isDev = process.argv.includes('--dev');

const postcssPlugin = {
  name: 'postcss',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const { readFile } = await import('node:fs/promises');
      const css = await readFile(args.path, 'utf8');
      const result = await postcss(postcssConfig.plugins).process(css, {
        from: args.path
      });
      return { contents: result.css, loader: 'css' };
    });
  }
};

const config = {
  entryPoints: { main: 'src/main.tsx' },
  bundle: true,
  outdir: '../../dist/web',
  platform: 'browser',
  format: 'esm',
  target: 'es2024',
  jsx: 'automatic',
  loader: { '.tsx': 'tsx', '.ts': 'tsx' },
  plugins: [postcssPlugin],
  alias: {
    '@': '../../libs'
  },
  ...(!isDev && {
    minify: true,
    treeShaking: true,
    dropLabels: ['DEV'],
    mangleProps: /^_/,
    legalComments: 'none'
  })
};

if (isDev) {
  const ctx = await esbuild.context(config);
  mkdirSync('../../dist/web', { recursive: true });
  copyFileSync('public/index.html', '../../dist/web/index.html');
  const { port } = await ctx.serve({
    servedir: '../../dist/web',
    port: 3000
  });
  console.log(`Web: http://localhost:${port}`);
} else {
  await esbuild.build(config);
  mkdirSync('../../dist/web', { recursive: true });
  copyFileSync('public/index.html', '../../dist/web/index.html');
  console.log('Built web');
}

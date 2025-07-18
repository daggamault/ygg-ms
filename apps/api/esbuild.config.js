import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import * as esbuild from 'esbuild';

const isDev = process.argv.includes('--dev');

const config = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: '../../dist/api/index.js',
  platform: 'node',
  format: 'esm',
  target: 'node22',
  packages: 'external',
  ...(!isDev && {
    minify: true,
    dropLabels: ['DEV']
  })
};

if (isDev) {
  let child;
  const restart = async () => {
    child?.kill();
    const outFile = '../../dist/api/index.js';

    // Wait for file to exist and be stable
    let attempts = 0;
    while (!existsSync(outFile) && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    if (existsSync(outFile)) {
      child = spawn('node', ['--env-file=apps/api/.env', 'dist/api/index.js'], {
        stdio: 'inherit',
        cwd: '../../'
      });
    }
  };

  const ctx = await esbuild.context({
    ...config,
    plugins: [
      {
        name: 'restart',
        setup: (build) =>
          build.onEnd(async () => {
            console.log('API rebuilt, restarting...');
            await restart();
          })
      }
    ]
  });

  await ctx.watch();
  console.log('Watching API...');
} else {
  await esbuild.build(config);
  console.log('Built API');
}

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import * as esbuild from 'esbuild';

const isDev = process.argv.includes('--dev');

const config = {
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: '../../dist/admin/index.js',
  platform: 'node',
  format: 'esm',
  target: 'node22',
  packages: 'external',
  alias: {
    '@': '../../libs'
  },
  ...(!isDev && {
    minify: true,
    dropLabels: ['DEV']
  })
};

if (isDev) {
  let child;
  const restart = async () => {
    child?.kill();
    const outFile = '../../dist/admin/index.js';

    // Wait for file to exist and be stable
    let attempts = 0;
    while (!existsSync(outFile) && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    if (existsSync(outFile)) {
      child = spawn(
        'node',
        ['--env-file=apps/admin/.env', 'dist/admin/index.js'],
        {
          stdio: 'inherit',
          cwd: '../../'
        }
      );
    }
  };

  const ctx = await esbuild.context({
    ...config,
    plugins: [
      {
        name: 'restart',
        setup: (build) =>
          build.onEnd(async () => {
            console.log('Admin rebuilt, restarting...');
            await restart();
          })
      }
    ]
  });

  await ctx.watch();
  console.log('Watching Admin...');
} else {
  await esbuild.build(config);
  console.log('Built Admin');
}

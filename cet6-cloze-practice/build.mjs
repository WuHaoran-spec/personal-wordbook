import { cp, mkdir, rm, access } from 'node:fs/promises';
try { await access('public/fonts/files'); }
catch {
  try {
    const fontRoot = 'node_modules/@fontsource-variable/noto-sans-sc';
    await mkdir('public/fonts', { recursive: true });
    await cp(`${fontRoot}/files`, 'public/fonts/files', { recursive: true });
    await cp(`${fontRoot}/LICENSE`, 'public/fonts/LICENSE');
  } catch { throw new Error('字体尚未准备，请先运行 npm install。'); }
}
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
console.log('Static site ready in dist/');

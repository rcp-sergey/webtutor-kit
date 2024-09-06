import fs from 'fs-extra';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function moveAssets() {
  const sourceDir = join(__dirname, '..', 'build', 'dapp', 'dapp', 'assets');
  const targetDir = join(__dirname, '..', 'build', 'dapp', 'assets');
  const redundantDir = join(__dirname, '..', 'build', 'dapp', 'dapp');

  try {
    await fs.move(sourceDir, targetDir, { overwrite: true });
    console.log('Assets successfully moved.');
    await fs.remove(redundantDir);
    console.log('Redundant directory removed.');
  } catch (err) {
    console.error(err);
  }
}

moveAssets();

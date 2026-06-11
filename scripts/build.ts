import { updateDist } from '@gkd-kit/tools';
import { updateReadMeMd } from './updateReadMeMd';
import subscription from './check';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const VERSION_FILE = 'version.txt';
let version = 0;
if (existsSync(VERSION_FILE)) {
  version = parseInt(readFileSync(VERSION_FILE, 'utf-8').trim() || '0', 10);
}
version++;
writeFileSync(VERSION_FILE, version.toString(), 'utf-8');

(subscription as { version: number }).version = version;

await updateDist(subscription);
await updateReadMeMd();

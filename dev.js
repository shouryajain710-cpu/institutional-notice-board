const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Institutional Notice Board System (Client + Server)...\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  try {
    server.kill();
    client.kill();
  } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
server.on('exit', (code) => {
  if (code !== 0 && code !== null) console.error(`Server process exited with code ${code}`);
});
client.on('exit', (code) => {
  if (code !== 0 && code !== null) console.error(`Client process exited with code ${code}`);
});

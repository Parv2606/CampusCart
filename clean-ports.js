// Gracefully frees up port 5000 and 5173 to prevent EADDRINUSE crashes on startup
const { execSync } = require('child_process');

function killPort(port) {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      const lines = output.trim().split('\n');
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid) && pid !== '0' && Number(pid) !== process.pid) {
          pids.add(pid);
        }
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          console.log(`Freed port ${port} by terminating PID ${pid}`);
        } catch (_) {}
      }
    } else {
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
    }
  } catch (_) {
    // Port was already free
  }
}

killPort(5000);
killPort(5173);
console.log('Ports 5000 and 5173 are clean and ready.');

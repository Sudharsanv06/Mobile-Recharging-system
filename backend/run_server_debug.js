process.on('exit', (code) => { console.log('process exit', code); });
process.on('uncaughtException', (err) => { console.error('uncaughtException', err && (err.stack || err.message || err)); });
process.on('unhandledRejection', (reason) => { console.error('unhandledRejection', reason); });

// start server
require('./server');
console.log('server required');

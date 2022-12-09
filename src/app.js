const { port } = require('./config');
const server = require('./server');

const boot = async () => {
  try {
    server.listen(port);
  } catch (err) {
    console.error(`ERROR in boot(): ${err.message || err}`);
  }
};

boot();

// const exitHandler = async (err) => {
//   if (err) console.error(err);

//   console.log('INFO: Processing shutdown...');
//   await db.close();
//   process.exit();
// };

// process.on('SIGINT', exitHandler);
// process.on('SIGTERM', exitHandler);

// process.on('SIGUSR1', exitHandler);
// process.on('SIGUSR2', exitHandler);

// process.on('uncaughtException', exitHandler);
// process.on('unhandledRejection', exitHandler);

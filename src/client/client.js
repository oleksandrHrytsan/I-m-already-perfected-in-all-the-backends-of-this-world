const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const dataFilePath = path.join(__dirname, 'data', 'test.csv');
// const testDataFilePath = path.join(__dirname, 'data', 'hello.csv');
// const readStream = fs.createReadStream(testDataFilePath);

// const { parse } = require('csv-parse');

const options = {
  host: `localhost`,
  port: 3000,
  path: '/',
  method: 'GET',
};

const getRequest = http.request(options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Error: ${res.statusCode}`);
    res.resume();
    return;
  }

  res.on('data', (data) => {
    console.log(`${data} - was received from server`);
  });

  res.on('close', () => {
    console.log('response closed!');
  });
});

getRequest.end();

getRequest.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});

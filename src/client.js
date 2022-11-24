const http = require('http');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'data', 'users.csv');
// const testDataFilePath = path.join(__dirname, 'data', 'hello.csv');
const readStream = fs.createReadStream(dataFilePath);

// const { parse } = require('csv-parse');

const options = {
  host: `localhost`,
  port: 3000,
  path: '/',
  method: 'POST',
};

const postRequest = http.request(options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Error: ${res.statusCode}`);
    res.resume();
    return;
  }

  res.on('data', (data) => {
    console.log(`${data} - was received from server`);
  });

  res.on('close', () => {
    console.log('done!');
  });
});

postRequest.on('error', (err) => console.log(`request error: ${err.message}`));

readStream.pipe(postRequest);

// postRequest.on('error', (err) => {
//   console.log(`Error: ${err.message}`);
// });

// readStream.on('error', (err) => console.log(err.message));

// readStream.once('data', () => {
//   console.log('start reading data!');
// });

// readStream.on('data', (chunk) => {
//   postRequest.write(chunk);
// });

// readStream.on('end', () => {
//   console.log('end reading data');
// });

// readStream.on('close', () => {
//   console.log('request was closed');
// });

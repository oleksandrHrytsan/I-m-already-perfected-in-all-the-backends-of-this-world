const http = require('http');
const fs = require('fs');
const path = require('path');

// const dataFilePath = path.join(__dirname, 'data', 'test.csv');

const server = http.createServer((req, res) => {
  const testDataFilePath = path.join(__dirname, 'data', 'hello.csv');
  const readStream = fs.createReadStream(testDataFilePath);

  if (req.method === 'GET') {
    res.on('error', (err) => {
      console.error(`Response error: ${err}`);
    });

    res.writeHead(200);

    readStream.on('data', (chunk) => {
      let rawData = [];

      rawData.push(chunk);
      res.write(rawData.toString(), (err) => {
        if (err) console.error(`Error on sending data. ${err}`);

        res.end('Success!');
      });
    });
  }
});

server.listen(3000);

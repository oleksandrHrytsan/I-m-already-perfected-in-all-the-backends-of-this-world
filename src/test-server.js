const http = require('http');
const fs = require('fs');
const path = require('path');

// const dataFilePath = path.join(__dirname, 'data', 'test.csv');

const server = http.createServer((req, res) => {
  const readFromPath = path.join(__dirname, 'data', 'hello.csv');
  const writeToPath = path.join(__dirname, 'data', 'written-by-server.csv');

  const readStream = fs.createReadStream(readFromPath);
  const writeStream = fs.createWriteStream(writeToPath, { flags: 'a' });

  const receivedData = [];

  let currentArrIndex = -1;

  function writeRecievedData() {
    if (receivedData.length === 0) {
      return;
    }

    currentArrIndex += 1;

    if (currentArrIndex === receivedData.length) {
      // console.log(receivedData[currentArrIndex]);
      currentArrIndex = -1;
      writeStream.end();
      return;
    }

    const nextDataElement = receivedData[currentArrIndex];

    const canContinue = writeStream.write(nextDataElement, (err) => {
      if (err) console.log(err);
    });

    if (!canContinue) {
      writeStream.once('drain', writeRecievedData);
    } else writeRecievedData();
  }

  if (req.method === 'GET') {
    res.on('error', (err) => {
      console.error(`Response error: ${err}`);
    });

    res.writeHead(200);

    readStream.on('data', (chunk) => {
      const rawData = [];

      rawData.push(chunk);
      res.write(rawData.toString(), (err) => {
        if (err) console.error(`Error on sending data. ${err}`);

        res.end('Success!');
      });
    });
  }

  if (req.method === 'POST') {
    res.on('error', (err) => {
      console.error(`Response error: ${err}`);
    });

    res.writeHead(200);

    req.on('data', (chunk) => {
      receivedData.push(chunk);
      writeRecievedData(receivedData);
    });

    writeStream.on('finish', () => {
      console.log('Data has been written');
      res.write('server finished writing data');
      res.end();
    });
  }
});

server.listen(3000);

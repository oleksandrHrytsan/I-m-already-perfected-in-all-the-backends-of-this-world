const http = require('http');
const fs = require('fs');
const path = require('path');

// const dataFilePath = path.join(__dirname, 'data', 'test.csv');

const server = http.createServer((req, res) => {
  const readFromPath = path.join(__dirname, 'data', 'hello.csv');
  const readStream = fs.createReadStream(readFromPath);

  const writeToPath = path.join(__dirname, 'data', 'written-by-server.csv');
  const writeStream = fs.createWriteStream(writeToPath, { flags: 'a' });

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

    if (fs.existsSync(writeToPath)) {
      fs.unlinkSync(writeToPath);
    }

    res.writeHead(200);

    req.pipe(writeStream);

    req.on('end', () => {
      console.log('Data has been written');
      res.write('server finished writing data');
      res.end();
    });
  }
});

server.listen(3000);

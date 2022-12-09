const http = require('http');
// const querystring = require('node:querystring');
// const url = require('node:url');
const { db: dbConfig } = require('../config');
const db = require('../db/db')(dbConfig);

const server = http.createServer(async (req, res) => {
  const currentUrl = new URL(`${req.url}`, 'http://localhost:3000/');
  const { pathname, searchParams } = currentUrl;

  if (req.method === 'POST' && pathname === '/users/addUser') {
    req.on('data', async (chunk) => {
      res.writeHead(200);

      try {
        const receivedData = chunk.toString('utf-8');

        const result = await db.addUser(JSON.parse(receivedData));

        res.write(JSON.stringify(result));
        res.end();
      } catch (err) {
        console.error(err.message || err);
      }
    });
  }

  if (req.method === 'POST' && pathname === '/bikes/addBike') {
    req.on('data', async (chunk) => {
      res.writeHead(200);

      try {
        const receivedData = chunk.toString('utf-8');

        const result = await db.addBike(JSON.parse(receivedData));

        res.write(JSON.stringify(result));
        res.end();
      } catch (err) {
        console.error(err.message || err);
      }
    });
  }

  if (req.method === 'GET' && pathname === '/bikes/getBikeByUserId') {
    res.writeHead(200);

    try {
      const userId = searchParams.get('id');

      const result = await db.getBikeByUserId(userId);

      res.write(JSON.stringify(result));
      res.end();
    } catch (err) {
      console.error(err.message || err);
    }
  }

  if (req.method === 'GET' && pathname === '/users/getUser') {
    res.writeHead(200);

    try {
      const userId = searchParams.get('id');
      // const userName = searchParams.get('name');

      const result = await db.getUser(userId);
      // const result = await db.getUserByName(userName);

      res.write(JSON.stringify(result));
      res.end();
    } catch (err) {
      console.error(err.message || err);
    }
  }

  if (req.method === 'GET' && pathname === '/users/getAllUsers') {
    res.writeHead(200);

    try {
      const result = await db.getAllUsers();

      res.write(JSON.stringify(result));
      res.end();
    } catch (err) {
      console.error(err.message || err);
    }
  }
});

module.exports = server;

const { faker } = require('@faker-js/faker');

const fs = require('fs');

const path = require('path');

const dataDirPath = path.join(__dirname, 'data');
const dataPath = path.join(__dirname, 'data', 'test.csv');
const writeStream = fs.createWriteStream(`${dataPath}`, { flags: 'a' });

const fieldNames = 'Id:, User-name:, Email:, Avatar:, Password:, Birth-date:, Date:';

const usersAmount = 10;

if (fs.existsSync(dataPath)) {
  fs.unlinkSync(dataPath);
}

function createRandomUser() {
  return `${faker.datatype.uuid()},${faker.internet.userName()},${faker.internet.email()},${faker.image.avatar()},${faker.internet.password()},${faker.date.birthdate()},${faker.date.past()}\n`;
}

function createDirectory() {
  if (!fs.existsSync(dataDirPath)) {
    fs.mkdir(path.join(__dirname, 'data'), (err) => {
      if (err) {
        throw err;
      }
    });
  }

  return;
}

function writeToFile(currentLoopCycle, totalCyclesAmount) {
  if (currentLoopCycle === totalCyclesAmount) {
    writeStream.end();
    return;
  }

  if (!writeStream.write(createRandomUser())) {
    writeStream.once('drain', writeToFile);
  }

  process.nextTick(writeToFile);
}

function generateUsers() {
  createDirectory();

  writeStream.write(fieldNames);

  for (let i = 0; i < usersAmount; i++) {
    writeToFile(i, usersAmount);
  }

  writeStream.on('finish', () => console.log(`File: ${dataPath} was generated`));
}

generateUsers();

const { faker } = require('@faker-js/faker');

const fs = require('fs');

const path = require('path');

const dataPath = path.join(__dirname, 'data', 'test.csv');
const directoryPath = path.join(__dirname, 'data');

const fieldNames = 'Id:, User-name:, Email:, Avatar:, Password:, Birth-date:, Date:';

if (fs.existsSync(dataPath)) {
  fs.unlinkSync(dataPath);
}

const writeStream = fs.createWriteStream(`${dataPath}`, { flags: 'a' });

function createDirectory() {
  fs.mkdir(path.join(__dirname, 'data'), (err) => {
    if (err) {
      throw err;
    }
  });
}

function createRandomUser() {
  return `${faker.datatype.uuid()},${faker.internet.userName()},${faker.internet.email()},${faker.image.avatar()},${faker.internet.password()},${faker.date.birthdate()},${faker.date.past()}\n`;
}

function generateUsers() {
  const users = [];

  users.push(fieldNames);

  for (let i = 0; i < 1005000; i++) {
    users.push(createRandomUser());
  }

  return users;
}

const generatedUsers = generateUsers();

let current = -1;

function writeUsersToCsvFile() {
  if (!fs.existsSync(directoryPath)) {
    createDirectory();
  }

  current += 1;

  if (current === generatedUsers.length) {
    return writeStream.end();
  }

  const nextUser = generatedUsers[current];

  const canContinue = writeStream.write(nextUser, (err) => {
    if (err) console.log(err);
  });

  if (!canContinue) {
    writeStream.once('drain', writeUsersToCsvFile);
  } else writeUsersToCsvFile();
}

writeUsersToCsvFile();

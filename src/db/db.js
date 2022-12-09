/* eslint-disable no-restricted-syntax */
const { Pool } = require('pg');
// const { v4: uuidv4 } = require('uuid');

// eslint-disable-next-line consistent-return
module.exports = (config) => {
  try {
    const client = new Pool(config);

    return {
      testConnection: async () => {
        try {
          console.log('pg test connection');
          await client.query('SELECT NOW()');
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      addUser: async ({ userName, birthDate, password }) => {
        try {
          if (!userName) {
            throw new Error('DB ERROR: no user name defined');
          }
          if (!birthDate) {
            throw new Error('DB ERROR: no user birthDate defined');
          }
          if (!password) {
            throw new Error('DB ERROR: no user password defined');
          }

          const timestamp = new Date();
          const result = await client.query(
            `
            INSERT INTO users(
            name, birth_date, password,
            created_at, updated_at, deleted_at) VALUES(
            $1, $2, $3, $4, $5, $6) RETURNING *
            `,
            [userName, birthDate, password, timestamp, timestamp, null],
          );

          console.log(`DB DEBUG: new user created: ${JSON.stringify(result.rows[0])}`);
          return result.rows[0];
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      addBike: async ({ userId, bikeName }) => {
        try {
          if (!userId) {
            throw new Error('DB ERROR: User id is not defined');
          }
          if (!bikeName) {
            throw new Error('DB ERROR: Bike name not defined');
          }

          const result = await client.query(
            `
            INSERT INTO bikes(user_id, bike_name) VALUES($1, $2) RETURNING *
            `,
            [userId, bikeName],
          );

          console.log(`DEBUG: new bike added" ${JSON.stringify(result.rows[0])}`);
          return result.rows[0];
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      getBikeByUserId: async (userId) => {
        try {
          if (!userId) {
            throw new Error('DB ERROR: No user id defined');
          }

          const result = await client.query(
            `
            SELECT * FROM bikes WHERE user_id = $1
            `,
            [userId],
          );
          return result.rows;
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      getUserByName: async (name) => {
        try {
          if (!name) {
            throw new Error('DB ERROR: User name not defined');
          }

          const result = await client.query(
            `
            SELECT * FROM users WHERE name = $1 AND deleted_at IS NULL
            `,
            [name],
          );

          return result.rows;
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      getAllUsers: async () => {
        try {
          const result = await client.query(`SELECT * FROM users`);
          return result.rows;
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      getUser: async (id) => {
        try {
          if (!id) {
            throw new Error('DB ERROR: no user id defined');
          }
          const result = await client.query(
            `
            SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL
            `,
            [id],
          );

          return result.rows[0];
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      updateUser: async ({ id, ...user }) => {
        try {
          if (!id) {
            throw new Error('DB ERROR: no user id defined');
          }

          const query = [];
          const values = [];

          for (const [i, [key, value]] of Object.entries(user).entries()) {
            query.push(`${key} = $${i + 1}`);
            values.push(value);
          }

          if (!values.length) {
            throw new Error('DB ERROR: Nothing to update');
          }

          values.push(id);

          const result = await client.query(
            `UPDATE users SET ${query.join(',')} WHERE id = $${values.length} RETURNING *`,
            values,
          );

          console.log(`DB DEBUG: user updated: ${JSON.stringify(result.rows[0])}`);
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },
    };
  } catch (err) {
    console.error(err.message || err);
  }
};

const { Pool } = require('pg');

// eslint-disable-next-line consistent-return
module.exports = (config) => {
  try {
    const client = new Pool(config);

    return {
      testConnection: async () => {
        try {
          console.log('hello from pg testConnection');
          await client.query('SELECT NOW()');
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      close: async () => {
        console.log('INFO Closing pg DB wrapper');
        client.end();
      },

      createProduct: async ({ type, color, price = 0, quantity = 1 }) => {
        try {
          if (!type) {
            throw new Error('ERROR: No product type defined');
          }
          if (!color) {
            throw new Error('ERROR: No product color defined');
          }

          const timestamp = new Date();

          const result = await client.query(
            'INSERT INTO products(type, color, price, quantity, created_at, updated_at, deleted_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [type, color, price, quantity, timestamp, timestamp, null],
          );

          console.log(`DEBUG: new product created: ${JSON.stringify(result.rows[0])}`);

          return result.rows[0];
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      getProduct: async (id) => {
        try {
          if (!id) {
            throw new Error('ERROR: no product id defined');
          }

          const result = await client.query(
            'SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL',
            [id],
          );

          return result.rows[0];
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      updateProduct: async ({ id, ...product }) => {
        try {
          if (!id) {
            throw new Error('ERROR: no user id defined');
          }

          const query = [];
          const values = [];

          // eslint-disable-next-line no-restricted-syntax
          for (const [i, [k, v]] of Object.entries(product).entries()) {
            query.push(`${k} = $${i + 1}`);
            values.push(v);
          }

          if (!values.length) {
            throw new Error('ERROR: Nothing to update');
          }

          values.push(id);

          const result = await client.query(
            `UPDATE products SET ${query.join(',')} WHERE id = $${values.length} RETURNING *`,
            values,
          );

          console.log(`DEBUG: Product updated: ${JSON.stringify(result.rows[0])}`);
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      deleteProduct: async (id) => {
        try {
          if (!id) {
            throw new Error('ERROR: no product id defined');
          }

          await client.query('UPDATE products SET deleted_at = $1 WHERE id = $2', [new Date(), id]);
          return true;
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

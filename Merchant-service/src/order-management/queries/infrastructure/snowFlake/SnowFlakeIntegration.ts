import snowflake from 'snowflake-sdk';
import Logger from '../../../../shared-kernel/infrastructure/logging/general.log';
import Env from '../../../../Env';
// region helper methods

function logError(message) {
  Logger.error(message);
}

function logInfo(message) {
  Logger.info(message);
}

function returnMockDate() {
  return Promise.resolve([
    {
      ORDER_STATUS: 'replacement_verified',
      TOTAL: 8,
    },
    {
      ORDER_STATUS: 'order_received',
      TOTAL: 1,
    },
    {
      ORDER_STATUS: 'suspended',
      TOTAL: 8,
    },
    {
      ORDER_STATUS: 'taager_cancelled',
      TOTAL: 10,
    },
    {
      ORDER_STATUS: 'refund_in_progress',
      TOTAL: 1,
    },
    {
      ORDER_STATUS: 'customer_rejected',
      TOTAL: 54,
    },
    {
      ORDER_STATUS: 'return_verified',
      TOTAL: 53,
    },
    {
      ORDER_STATUS: 'delivery_in_progress',
      TOTAL: 1,
    },
    {
      ORDER_STATUS: 'delivered',
      TOTAL: 250,
    },
    {
      ORDER_STATUS: 'refund_verified',
      TOTAL: 8,
    },
    {
      ORDER_STATUS: 'customer_rejeced',
      TOTAL: 4,
    },
    {
      ORDER_STATUS: 'return_in_progress',
      TOTAL: 1,
    },
    {
      ORDER_STATUS: 'cancel',
      TOTAL: 7,
    },
  ]);
}

// endregion

/**
 * @returns {Promise}
 */
function createConnection() {
  // Create a Connection object
  return new Promise((resolve, reject) => {
    try {
      resolve(
        snowflake.createConnection({
          account: Env.SNOWFLAKE_ACCOUNT,
          username: Env.SNOWFLAKE_USERNAME,
          password: Env.SNOWFLAKE_PASSWORD,
          database: Env.SNOWFLAKE_DATABASE,
          schema: Env.SNOWFLAKE_SCHEMA,
          warehouse: Env.SNOWFLAKE_WAREHOUSE,
          role: Env.SNOWFLAKE_ROLE,
        }),
      );
    } catch (e) {
      logError(`error while creating connection object:${e}`);
      reject(e);
    }
  });
}

/**
 * @returns {Promise}
 */
function connect(connection) {
  return new Promise((resolve, reject) => {
    // Try to connect to Snowflake, and check whether the connection was successful and return it.
    return connection.connect((err, conn) => {
      if (err) {
        logError(`Unable to connect: ${err.message}`);
        reject(err);
      } else {
        logInfo('Successfully connected to Snowflake.');
        resolve(conn);
      }
    });
  });
}

function executeInternal(connection, queryObject) {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: queryObject.query,
      binds: queryObject.bind,

      // on complete
      complete: (err, stmt, rows) => {
        if (err) {
          logError(`Failed to execute statement due to the following error: ${err.message}`);
          reject(err);
        } else {
          logInfo(`Number of rows produced: ${JSON.stringify(rows)}`);
          resolve(rows);
        }
      },
    });
  });
}

/**
 * @description
 * @param {SnowFlakeQuery} queryObject
 * @returns Promise<Array>
 */
export function executeQuery(queryObject) {
  // wrap the body call into promise

  // return mock data if mock enabled for testing purpose
  if (Env.SNOWFLAKE_MOCK_ENABLED === 'true') {
    logInfo(`SNOWFLAKE_MOCK_ENABLED: ${Env.SNOWFLAKE_MOCK_ENABLED}`);
    return returnMockDate();
  }

  // connect to snowFlake then execute the query
  return createConnection()
    .then(connect)
    .then(conn => executeInternal(conn, queryObject));
}



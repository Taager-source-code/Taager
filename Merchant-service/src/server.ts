/**
 * Module dependencies.
 */
import http from 'http';

import app from './app';

import io from './shared-kernel/infrastructure/config/socket.io';
import * as featureToggles from './shared-kernel/infrastructure/toggles/featureToggles';
import Env from './Env';
import {
  connectDefaultConnectionToMongoDB, createNonDefaultMongoConnection,
  disconnectDefaultFromMongoDB, disconnectNonDefaultFromMongoDB
} from './shared-kernel/infrastructure/config/mongoose';
import MigrationExecutor from "./migrations/migrationExecutor";
import Logger from "./shared-kernel/infrastructure/logging/general.log";
import { secondaryConnection } from "./shared-kernel/infrastructure/config/mongoose-secondary";

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = val => {
  const portNum = Number(val);
  if (Number.isNaN(portNum)) {
    // named pipe
    return val;
  }
  if (portNum >= 0) {
    // port number
    return portNum;
  }
  return false;
};

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(Env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};
/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = server.address();

  // eslint-disable-next-line prettier/prettier
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.log(`Listening on ${bind}`);
};

/**
 * Connect to database and listen on provided port, on all network interfaces.
 */

export const bootstrapServer = async () => {
  try {
    await connectDefaultConnectionToMongoDB();
    await createNonDefaultMongoConnection(secondaryConnection, Env.MONGO_URI)
  } catch (err){
    Logger.error(`Bootstrap server error: ${(err as Error).stack}`);
    throw err;
  }
  await featureToggles.connect();
  await new MigrationExecutor().migrateAll();
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  io.attach(server, { pingTimeout: 60000 });
};

export const closeServer = async () => {
  await new Promise<void>((resolve, reject) => {
    server.close(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
  await disconnectDefaultFromMongoDB();
  await disconnectNonDefaultFromMongoDB(secondaryConnection);
};



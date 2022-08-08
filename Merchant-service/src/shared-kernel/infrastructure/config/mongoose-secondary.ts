import mongoose, { Connection } from 'mongoose';
import Env from '../../../Env';

export const connectDefaultConnectionToMongoDB = (uri = Env.MONGO_URI) =>
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

export const createNonDefaultMongoConnection = async (connection: Connection, uri = Env.MONGO_URI) => {
  return connection.openUri(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

export const disconnectDefaultFromMongoDB = () => mongoose.disconnect();
export const disconnectNonDefaultFromMongoDB = (connection: Connection) => connection.close();



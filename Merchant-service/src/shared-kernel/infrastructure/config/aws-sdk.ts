import aws from 'aws-sdk';
import Env from '../../../Env';

export const s3 = new aws.S3({
  endpoint: new aws.Endpoint(Env.SPACES_ENDPOINT),
  accessKeyId: Env.SPACES_ACCESS_KEY,
  secretAccessKey: Env.SPACES_SECRET_KEY,
  region: 'us-east-2',
});



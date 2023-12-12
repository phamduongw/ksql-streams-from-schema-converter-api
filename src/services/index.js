const dotenv = require('dotenv');
const couchbase = require('couchbase');

dotenv.config();

let cluster;
let bucket;
let scope;

const connectToCouchbase = async () => {
  const connectionOptions = {
    username: process.env.COUCHBASE_USERNAME,
    password: process.env.COUCHBASE_PASSWORD,
    configProfile: 'wanDevelopment',
  };

  try {
    cluster = await couchbase.connect(
      process.env.COUCHBASE_URL,
      connectionOptions,
    );
    bucket = cluster.bucket(process.env.COUCHBASE_BUCKET_NAME);
    scope = bucket.scope(process.env.COUCHBASE_SCOPE_NAME);
    console.log('Connected to Couchbase');
  } catch (error) {
    console.error('Error connecting to Couchbase:', error);
    throw error;
  }
};

const getSchema = async (key) => {
  try {
    const query =
      'SELECT meta().id as schema_name, fields FROM `schema` USE KEYS [$1]';
    const result = await scope.query(query, { parameters: [key] });
    return result.rows[0];
  } catch (error) {
    console.error('Error getting schema:', error);
    throw error;
  }
};

module.exports = { connectToCouchbase, getSchema };

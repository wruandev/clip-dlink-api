import type { Knex } from 'knex';
import { envValidation } from './utils';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUser = envValidation.checkIfDefined(
  process.env.DBUSER,
  'DBUSER Environment variable is not defined',
);
const dbPassword = envValidation.checkIfDefined(
  process.env.DBPASSWORD,
  'DBPASSWORD Environment variable is not defined',
);
const dbPort = parseInt(
  envValidation.checkIfDefined(process.env.DBPORT, 'DBPORT Environment variable is not defined'),
  10,
);
const dbHost = envValidation.checkIfDefined(
  process.env.DBHOST,
  'DBHOST Environment variable is not defined',
);
const dbName = envValidation.checkIfDefined(
  process.env.DBNAME,
  'DBNAME Environment variable is not defined',
);

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    },
    // debug: true,
  },
};

export default config;

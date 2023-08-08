import * as dotenv from 'dotenv';
import { envValidation } from './../utils';

dotenv.config();

const baseUrl = envValidation.checkIfDefined(
  process.env.BASEURL,
  'BASEURL Environment variable is not defined',
);

const jwtSecret = envValidation.checkIfDefined(
  process.env.JWTSECRET,
  'JWTSECRET Environment variable is not defined',
);

const jwtSaltRounds = parseInt(
  envValidation.checkIfDefined(
    process.env.JWTSALTROUNDS,
    'JWTSALTROUNDS Environment variable is not defined',
  ),
  10,
);

const notFoundURL = envValidation.checkIfDefined(
  process.env.NOTFOUNDURL,
  'NOTFOUNDURL Environment variable is not defined',
);

// remove - and _ from generated nano id
const nanoidCustomAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const urlSlugLength = 8;

export const config = {
  baseUrl,
  notFoundURL,
  jwtSecret,
  jwtSaltRounds,
  nanoidCustomAlphabet,
  urlSlugLength,
};

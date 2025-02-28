import 'dotenv/config';
import * as joi from 'joi';

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_NAME: joi.string().required(),
    MONGO_DB_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    PASSWORD_SECRET_EMAIL: joi.string().required(),
    EMAIL_SENDER: joi.string().required(),
  })
  .unknown(true);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

interface Env {
  PORT: number;
  DB_NAME: string;
  MONGO_DB_URL: string;
  JWT_SECRET: string;
  PASSWORD_SECRET_EMAIL: string;
  EMAIL_SENDER: string;
}

const env: Env = value as Env;

export const envs = {
  PORT: env?.PORT,
  DB_NAME: env?.DB_NAME,
  MONGO_DB_URL: env?.MONGO_DB_URL,
  JWT_SECRET: env?.JWT_SECRET,
  PASSWORD_SECRET_EMAIL: env?.PASSWORD_SECRET_EMAIL,
  EMAIL_SENDER: env?.EMAIL_SENDER,
};

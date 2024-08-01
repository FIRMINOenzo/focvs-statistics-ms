import * as dotenv from 'dotenv';

function getEnv() {
  return {
    app: {
      id: process.env.APP_ID,
      env: process.env.APP_ENV,
      name: process.env.APP_NAME,
      description: process.env.APP_DESCRIPTION,
      version: process.env.APP_VERSION,
      port: Number.parseInt(process.env.PORT)
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: Number.parseInt(process.env.REDIS_PORT)
    },
    isProduction(): boolean {
      return env.app.env !== 'local' && env.app.env !== 'development' && env.app.env !== 'homolog';
    }
  };
}

dotenv.config();

export const env = getEnv();

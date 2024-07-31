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
    isProduction(): boolean {
      return env.app.env !== 'local' && env.app.env !== 'development' && env.app.env !== 'homolog';
    }
  };
}

dotenv.config();

export const env = getEnv();

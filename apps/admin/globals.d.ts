declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      REDIS_URL: string;
      DATABASE_URL: string;
    }
  }
}

export {};

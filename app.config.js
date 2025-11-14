import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      API_URL: process.env.API_URL,
      APP_ENV: process.env.APP_ENV,
    }
  };
};

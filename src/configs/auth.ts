export const authConfigs = {
  jwt: {
    secret: process.env.AUTH_CONFIG_SECRET || 'default',
    expiresIn: '1d',
  },
};

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  bcrypt: {
    salt: parseInt(process.env.BCRYPT_SALT || '10', 10),
  },
  timezone: process.env.TZ || 'America/Lima',
  jwt: {
    secret: process.env.JWT_SECRET || 'defaultSecret',
  },
});

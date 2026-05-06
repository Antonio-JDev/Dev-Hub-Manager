export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL ?? 
      `postgresql://${process.env.DB_USER ?? 'devhub'}:${process.env.DB_PASSWORD ?? 'devhub'}@${process.env.DB_HOST ?? 'localhost'}:${process.env.DB_PORT ?? '5432'}/${process.env.DB_NAME ?? 'devhub_manager'}`,
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    name: process.env.DB_NAME ?? 'devhub_manager',
    user: process.env.DB_USER ?? 'devhub',
    password: process.env.DB_PASSWORD ?? 'devhub',
  },
  jwt: {
    accessTokenTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTokenTtl: process.env.JWT_REFRESH_TTL ?? '7d',
    secret: process.env.JWT_SECRET ?? 'devhub-secret',
  },
});

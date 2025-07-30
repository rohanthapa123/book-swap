import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Never true in prod!
  logging: !isProduction,
  entities: isProduction ? ['dist/entity/*.js'] : ['src/entity/*.ts'],
  migrations: isProduction ? ['src/migrations/production/*.ts'] : ['src/migrations/development/*.ts'],
  subscribers: [],
});

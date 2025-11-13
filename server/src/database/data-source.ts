import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { Deal } from '../deals/entities/deal.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'app',
  entities: [Client, Deal],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
});

export default dataSource;


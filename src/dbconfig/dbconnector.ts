import { Pool } from 'pg';

export default new Pool ({
  max: 20,
  // connectionString: 'postgres://postgres:postgres@postgres:5432',
  connectionString: 'postgres://postgres:postgres@localhost:5432',
  idleTimeoutMillis: 30000
});
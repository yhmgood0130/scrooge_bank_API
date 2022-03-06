import { Pool } from 'pg';

export default new Pool ({
  max: 20,
  connectionString: 'postgres://postgres:master@localhost:5432',
  // connectionString: 'postgres://yourdatabase:yourpassword@localhost:5432',
  idleTimeoutMillis: 30000
});
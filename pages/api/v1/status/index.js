import database from 'infra/database';

async function status(req, res) {
  const updatedAt = new Date().toISOString();

  const result = await database.query('SELECT version();');
  const postgresVersion = result.rows[0].version;

  const result1 = await database.query('SHOW server_version;');
  const serverVersion = result1.rows[0].server_version;

  const result2 = await database.query('SHOW max_connections;');
  const maxConnections = result2.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  console.log(`Banco de dados selecionado: ${databaseName}`);
  const result3 = await database.query({
    text: 'SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;',
    values: [databaseName],
  });
  // `SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';`
  // Para fazer um um SQL Injection, você pode passar algo como:
  // `SELECT count(*)::int FROM pg_stat_activity WHERE datname = '';`
  // `SELECT count(*)::int FROM pg_stat_activity WHERE datname = '';';`
  // `SELECT count(*)::int FROM pg_stat_activity WHERE datname = ''; SELECT pg_sleep(4);';`
  // `SELECT count(*)::int FROM pg_stat_activity WHERE datname = ''; SELECT pg_sleep(4); --';`

  const usedConnections = result3.rows[0].count;

  const statusResponse = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        info: postgresVersion,
        version: serverVersion,
        max_connections: parseInt(maxConnections, 10),
        opened_connections: usedConnections,
      },
    },
  };

  res.status(200).send(statusResponse);
}

export default status;

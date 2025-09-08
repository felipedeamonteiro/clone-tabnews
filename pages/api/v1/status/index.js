import database from '../../../../infra/database';

async function status(req, res) {
  const result = await database.query('SELECT 1 + 1 as sum;');
  console.log('database query result:', result.rows);
  res.status(200).send({ message: 'API is working' });
}

export default status;

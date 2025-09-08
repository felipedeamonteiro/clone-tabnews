const database = require('../../../../../infra/database.js');

test('GET to /api/v1/status should return 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/status');
  console.log('database', database);
  expect(response.status).toBe(200);
});

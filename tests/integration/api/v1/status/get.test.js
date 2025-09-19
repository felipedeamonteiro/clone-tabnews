test('GET to /api/v1/status should return 200', async () => {
  const response = await fetch('http://localhost:3001/api/v1/status');
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.database.info).toBeDefined();
  expect(responseBody.dependencies.database.info).toBeTruthy();
  expect(responseBody.dependencies.database.version).toBe('16.0');
  expect(typeof responseBody.dependencies.database.max_connections).toBe(
    'number'
  );
  // The idea behind this test is that if we have more than 1 opened connection
  // maybe we have a connection leak
  expect(responseBody.dependencies.database.opened_connections).toBe(1);
});

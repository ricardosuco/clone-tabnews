import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.updated_at).toBe(parsedUpdatedAt);
  expect(new Date(responseBody.updated_at)).toBeInstanceOf(Date);
  expect(responseBody.dependencies.database.version).toBeDefined();
  expect(responseBody.dependencies.database.version).toBe("16.0");
  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
  expect(responseBody.dependencies.database.opened_connections).toBeDefined();
  expect(responseBody).toMatchObject({
    updated_at: expect.any(String),
    dependencies: {
      database: {
        version: expect.any(String),
        max_connections: expect.any(String),
        opened_connections: expect.any(Number),
      },
    },
  });
});

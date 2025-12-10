import { createRouter } from "next-connect";
import database from "infra/database.js";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();

router.get(getHandler);

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

async function getHandler(request, response) {
    const updatedAt = new Date().toISOString();
    const databaseVersion = await database.query("SHOW server_version;");
    const databaseMaxConnections = await database.query(
      "SHOW max_connections;",
    );
    const databaseOpenedConnections = await database.query({
      text: "SELECT COUNT(*)::int FROM pg_stat_activity where datname = $1;",
      values: [process.env.POSTGRES_DATABASE],
    });

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersion.rows[0].server_version,
          max_connections: databaseMaxConnections.rows[0].max_connections,
          opened_connections: databaseOpenedConnections.rows[0].count,
        },
      },
    });
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  console.log("\n Erro dentro do catch do next-connect:");
  console.error(publicErrorObject);
  response.status(500).json(publicErrorObject);
}

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

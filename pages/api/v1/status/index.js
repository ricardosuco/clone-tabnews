import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersion = await database.query("SHOW server_version;");
  const databaseMaxConnections = await database.query("SHOW max_connections;");
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

export default status;

const { exec } = require("node:child_process"); // Com este módulo é possível inicializar processo filhos a partir do processo atual do node.js
function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }
    process.stdout.write("\n✅ Postgres está pronto e aceitando conexões\n");
  }
}
process.stdout.write("\n⌛ Aguardando postgres aceitar conexões");
checkPostgres();

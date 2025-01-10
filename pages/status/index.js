import useSWR from "swr";

async function fetchApi(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data, error } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return (
      <>
        <div>Erro ao carregar os dados.</div>
        <div>{error.data}</div>
      </>
    );
  }

  const updatedAt = new Date(data.updated_at).toLocaleString("pt-BR");
  const maxConnections = data.dependencies.database.max_connections;
  const postgresVersion = data.dependencies.database.version;
  const openedConnections = data.dependencies.database.opened_connections;

  return (
    <>
      <div>Última atualização: {updatedAt}</div>
      <div>Versão do postgres: {postgresVersion}</div>
      <div>Limite de conexões permitidas: {maxConnections}</div>
      <div>Total de conexões abertas: {openedConnections}</div>
    </>
  )
}

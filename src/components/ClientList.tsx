import type { Client } from '../types/salon';
import { formatDate } from '../utils/date';

interface ClientListProps {
  clients: Client[];
  onNewClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
}

function ClientList({
  clients,
  onNewClient,
  onEditClient,
  onDeleteClient,
}: ClientListProps) {
  const sortedClients = [...clients].sort(
    (a, b) =>
      b.lastVisit.localeCompare(a.lastVisit),
  );

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Clients</h2>
          <p>
            Customer relationship overview
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onNewClient}
        >
          + New Client
        </button>
      </div>

      {sortedClients.length === 0 ? (
        <div className="empty-state">
          No clients yet.
        </div>
      ) : (
        <div className="client-table">
          <div className="client-table-header">
            <span>Name</span>
            <span>Visits</span>
            <span>Last Visit</span>
            <span>Favorite Service</span>
            <span>Total Spent</span>
            <span>Actions</span>
          </div>

          {sortedClients.map((client) => (
            <div
              className="client-table-row"
              key={client.id}
            >
              <strong>{client.name}</strong>

              <span>{client.visits}</span>

              <span>
                {client.lastVisit
                  ? formatDate(client.lastVisit)
                  : '—'}
              </span>

              <span>
                {client.favoriteService || '—'}
              </span>

              <span>
                ${client.totalSpent.toFixed(0)}
              </span>

              <div className="table-actions">
                <button
                  type="button"
                  className="edit-button"
                  onClick={() =>
                    onEditClient(client)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    onDeleteClient(client)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ClientList;

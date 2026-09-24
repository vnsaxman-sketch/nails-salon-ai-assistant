import { useState } from 'react';
import type { Client } from '../types/salon';

interface ClientFormProps {
  client?: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
}

function ClientForm({
  client,
  onSave,
  onCancel,
}: ClientFormProps) {
  const [name, setName] = useState(client?.name ?? '');
  const [phone, setPhone] = useState(client?.phone ?? '');
  const [email, setEmail] = useState(client?.email ?? '');
  const [favoriteService, setFavoriteService] = useState(
    client?.favoriteService ?? '',
  );
  const [notes, setNotes] = useState(client?.notes ?? '');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      alert('Please enter the client name.');
      return;
    }

    const savedClient: Client = {
      id: client?.id ?? crypto.randomUUID(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      visits: client?.visits ?? 0,
      lastVisit: client?.lastVisit ?? '',
      favoriteService: favoriteService.trim(),
      totalSpent: client?.totalSpent ?? 0,
      notes: notes.trim(),
    };

    onSave(savedClient);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>{client ? 'Edit Client' : 'New Client'}</h2>
            <p>
              {client
                ? 'Update client information'
                : 'Add a new salon client'}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="client-name">
                Name *
              </label>

              <input
                id="client-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Client name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="client-phone">
                Phone
              </label>

              <input
                id="client-phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="(858) 555-0100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="client-email">
                Email
              </label>

              <input
                id="client-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="client@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="client-service">
                Favorite Service
              </label>

              <input
                id="client-service"
                type="text"
                value={favoriteService}
                onChange={(event) =>
                  setFavoriteService(event.target.value)
                }
                placeholder="Gel Manicure"
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="client-notes">
                Notes
              </label>

              <textarea
                id="client-notes"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Client preferences, notes, etc."
                rows={4}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              {client ? 'Save Changes' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientForm;

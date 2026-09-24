import { useState } from 'react';
import type {
  Appointment,
  AppointmentStatus,
  Client,
  Service,
} from '../types/salon';

interface AppointmentFormProps {
  appointment?: Appointment;
  clients: Client[];
  services: Service[];
  onSave: (appointment: Appointment) => void;
  onCancel: () => void;
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

function AppointmentForm({
  appointment,
  clients,
  services,
  onSave,
  onCancel,
}: AppointmentFormProps) {
  const [clientId, setClientId] = useState(
    appointment?.clientId ?? clients[0]?.id ?? '',
  );

  const [service, setService] = useState(
    appointment?.service ?? services[0]?.name ?? '',
  );

  const [date, setDate] = useState(
    appointment?.date ?? '',
  );

  const [time, setTime] = useState(
    appointment?.time ?? '',
  );

  const [duration, setDuration] = useState(
    appointment?.duration ??
      services[0]?.duration ??
      60,
  );

  const [price, setPrice] = useState(
    appointment?.price ??
      services[0]?.price ??
      0,
  );

  const [status, setStatus] =
    useState<AppointmentStatus>(
      appointment?.status ?? 'Scheduled',
    );

  const [notes, setNotes] = useState(
    appointment?.notes ?? '',
  );

  function handleServiceChange(
    serviceName: string,
  ) {
    setService(serviceName);

    const selectedService = services.find(
      (item) => item.name === serviceName,
    );

    if (selectedService) {
      setDuration(selectedService.duration);
      setPrice(selectedService.price);
    }
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!clientId) {
      alert('Please select a client.');
      return;
    }

    if (!service) {
      alert('Please select a service.');
      return;
    }

    if (!date) {
      alert('Please select an appointment date.');
      return;
    }

    if (!time) {
      alert('Please select an appointment time.');
      return;
    }

    const selectedClient = clients.find(
      (client) => client.id === clientId,
    );

    if (!selectedClient) {
      alert('Please select a valid client.');
      return;
    }

    const newAppointment: Appointment = {
      id:
        appointment?.id ??
        createId('appointment'),

      clientId: selectedClient.id,

      clientName: selectedClient.name,

      service,

      date,

      time,

      duration: Number(duration),

      price: Number(price),

      status,

      notes: notes.trim(),
    };

    console.log(
      'Saving appointment:',
      newAppointment,
    );

    onSave(newAppointment);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>
              {appointment
                ? 'Edit Appointment'
                : 'New Appointment'}
            </h2>

            <p>
              {appointment
                ? 'Update appointment information'
                : 'Schedule a new appointment'}
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

        {clients.length === 0 ? (
          <div className="form-warning">
            <strong>
              No clients available.
            </strong>

            <p>
              Please add a client before creating
              an appointment.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onCancel}
              >
                Close
              </button>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="form-warning">
            <strong>
              No services available.
            </strong>

            <p>
              Please add a salon service before
              creating an appointment.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onCancel}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="appointment-client">
                  Client *
                </label>

                <select
                  id="appointment-client"
                  value={clientId}
                  onChange={(event) =>
                    setClientId(event.target.value)
                  }
                  required
                >
                  <option value="">
                    Select client
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="appointment-service">
                  Service *
                </label>

                <select
                  id="appointment-service"
                  value={service}
                  onChange={(event) =>
                    handleServiceChange(
                      event.target.value,
                    )
                  }
                  required
                >
                  <option value="">
                    Select service
                  </option>

                  {services.map((item) => (
                    <option
                      key={item.id}
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="appointment-date">
                  Date *
                </label>

                <input
                  id="appointment-date"
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  required
                />

                {date && (
                  <small>
                    Selected:{' '}
                    {date.substring(5, 7)}-
                    {date.substring(8, 10)}-
                    {date.substring(0, 4)}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="appointment-time">
                  Time *
                </label>

                <input
                  id="appointment-time"
                  type="time"
                  value={time}
                  onChange={(event) =>
                    setTime(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment-duration">
                  Duration (minutes)
                </label>

                <input
                  id="appointment-duration"
                  type="number"
                  min="15"
                  step="15"
                  value={duration}
                  onChange={(event) =>
                    setDuration(
                      Number(event.target.value),
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment-price">
                  Price ($)
                </label>

                <input
                  id="appointment-price"
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      Number(event.target.value),
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment-status">
                  Status
                </label>

                <select
                  id="appointment-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as AppointmentStatus,
                    )
                  }
                >
                  <option value="Scheduled">
                    Scheduled
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                  <option value="No-show">
                    No-show
                  </option>
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="appointment-notes">
                  Notes
                </label>

                <textarea
                  id="appointment-notes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="Appointment notes..."
                  rows={3}
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
                {appointment
                  ? 'Save Changes'
                  : 'Create Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AppointmentForm;

import type { Appointment } from '../types/salon';
import { formatDate } from '../utils/date';

interface AppointmentListProps {
  appointments: Appointment[];
  onNewAppointment: () => void;
  onEditAppointment: (
    appointment: Appointment,
  ) => void;
  onDeleteAppointment: (
    appointment: Appointment,
  ) => void;
}

function AppointmentList({
  appointments,
  onNewAppointment,
  onEditAppointment,
  onDeleteAppointment,
}: AppointmentListProps) {
  const sortedAppointments = [...appointments].sort(
    (a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }

      return a.time.localeCompare(b.time);
    },
  );

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Appointments</h2>
          <p>Salon appointment schedule</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onNewAppointment}
        >
          + Appointment
        </button>
      </div>

      {sortedAppointments.length === 0 ? (
        <div className="empty-state">
          No appointments.
        </div>
      ) : (
        <div className="appointment-list">
          {sortedAppointments.map(
            (appointment) => (
              <div
                className="appointment-row"
                key={appointment.id}
              >
                <div className="appointment-time">
                  {appointment.time}
                </div>

                <div className="appointment-client">
                  <strong>
                    {appointment.clientName}
                  </strong>

                  <span>
                    {appointment.service}
                  </span>

                  <small>
                    {formatDate(appointment.date)}
                  </small>
                </div>

                <div className="appointment-duration">
                  {appointment.duration} min
                </div>

                <div className="appointment-price">
                  ${appointment.price}
                </div>

                <span
                  className={`status status-${appointment.status
                    .toLowerCase()
                    .replace(' ', '-')}`}
                >
                  {appointment.status}
                </span>

                <div className="table-actions">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() =>
                      onEditAppointment(
                        appointment,
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      onDeleteAppointment(
                        appointment,
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}

export default AppointmentList;

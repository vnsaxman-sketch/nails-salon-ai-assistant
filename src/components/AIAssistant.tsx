import { useMemo, useState } from 'react';
import type { Client, SalonData } from '../types/salon';
import { getTodayString } from '../utils/date';

interface AIAssistantProps {
  salonData: SalonData;
}

interface FollowUpClient extends Client {
  daysSinceVisit: number;
  priority: 'High' | 'Medium' | 'Low';
}

function AIAssistant({
  salonData,
}: AIAssistantProps) {
  const [selectedMessage, setSelectedMessage] =
    useState<string | null>(null);

  const today = getTodayString();

  const analysis = useMemo(() => {
    const clients = salonData.clients;
    const appointments = salonData.appointments;

    const todayAppointments =
      appointments.filter(
        (appointment) =>
          appointment.date === today &&
          appointment.status !== 'Cancelled',
      );

    const completedToday =
      todayAppointments.filter(
        (appointment) =>
          appointment.status === 'Completed',
      );

    const todayRevenue =
      completedToday.reduce(
        (sum, appointment) =>
          sum + Number(appointment.price || 0),
        0,
      );

    const completedAppointments =
      appointments.filter(
        (appointment) =>
          appointment.status === 'Completed',
      );

    const totalCompletedRevenue =
      completedAppointments.reduce(
        (sum, appointment) =>
          sum + Number(appointment.price || 0),
        0,
      );

    const cancelledCount =
      appointments.filter(
        (appointment) =>
          appointment.status === 'Cancelled',
      ).length;

    const noShowCount =
      appointments.filter(
        (appointment) =>
          appointment.status === 'No-show',
      ).length;

    const repeatClients = clients.filter(
      (client) => client.visits >= 2,
    );

    const newClients = clients.filter(
      (client) => client.visits <= 1,
    );

    const highValueClients = [...clients]
      .filter(
        (client) =>
          Number(client.totalSpent || 0) >= 300,
      )
      .sort(
        (a, b) =>
          b.totalSpent - a.totalSpent,
      );

    const followUps: FollowUpClient[] = [];

    const currentDate = new Date(
      `${today}T00:00:00`,
    );

    clients.forEach((client) => {
      if (!client.lastVisit) {
        return;
      }

      const lastVisit = new Date(
        `${client.lastVisit}T00:00:00`,
      );

      const daysSinceVisit = Math.floor(
        (currentDate.getTime() -
          lastVisit.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysSinceVisit >= 42) {
        let priority: FollowUpClient['priority'] =
          'Low';

        if (
          client.totalSpent >= 300 ||
          client.visits >= 5
        ) {
          priority = 'High';
        } else if (client.visits >= 2) {
          priority = 'Medium';
        }

        followUps.push({
          ...client,
          daysSinceVisit,
          priority,
        });
      }
    });

    followUps.sort((a, b) => {
      const priorityValue = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      const priorityDifference =
        priorityValue[b.priority] -
        priorityValue[a.priority];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return (
        b.daysSinceVisit -
        a.daysSinceVisit
      );
    });

    const serviceCounts: Record<
      string,
      number
    > = {};

    appointments.forEach((appointment) => {
      if (
        appointment.status === 'Cancelled' ||
        appointment.status === 'No-show'
      ) {
        return;
      }

      serviceCounts[appointment.service] =
        (serviceCounts[appointment.service] || 0) +
        1;
    });

    const popularService =
      Object.entries(serviceCounts).sort(
        (a, b) => b[1] - a[1],
      )[0];

    const upcomingAppointments =
      appointments
        .filter(
          (appointment) =>
            appointment.date >= today &&
            appointment.status === 'Scheduled',
        )
        .sort((a, b) => {
          const first =
            `${a.date} ${a.time}`;

          const second =
            `${b.date} ${b.time}`;

          return first.localeCompare(second);
        });

    return {
      todayAppointments,
      todayRevenue,
      totalCompletedRevenue,
      cancelledCount,
      noShowCount,
      repeatClients,
      newClients,
      highValueClients,
      followUps,
      popularService,
      upcomingAppointments,
    };
  }, [salonData, today]);

  function createDraftMessage(
    client: FollowUpClient,
  ) {
    const favorite =
      client.favoriteService ||
      'your favorite service';

    const message =
      `Hi ${client.name}! We miss seeing you at the salon. ` +
      `It has been about ${client.daysSinceVisit} days since your last visit. ` +
      `If you're ready for a refresh, we'd love to see you again for ${favorite}. ` +
      `Please let us know if you'd like to schedule an appointment. 💅`;

    setSelectedMessage(message);
  }

  function closeMessage() {
    setSelectedMessage(null);
  }

  return (
    <section className="ai-panel">
      <div className="ai-header">
        <div className="ai-icon">✦</div>

        <div>
          <h2>AI Business Assistant</h2>

          <p>
            Local analysis of your salon data
          </p>
        </div>
      </div>

      <div className="ai-summary">
        <h3>
          What should I pay attention to today?
        </h3>

        <div className="ai-metrics">
          <div className="ai-metric">
            <strong>
              {analysis.todayAppointments.length}
            </strong>

            <span>
              Today's appointments
            </span>
          </div>

          <div className="ai-metric">
            <strong>
              ${analysis.todayRevenue.toFixed(0)}
            </strong>

            <span>
              Today's revenue
            </span>
          </div>

          <div className="ai-metric">
            <strong>
              {analysis.followUps.length}
            </strong>

            <span>
              Follow-ups
            </span>
          </div>

          <div className="ai-metric">
            <strong>
              {analysis.highValueClients.length}
            </strong>

            <span>
              High-value clients
            </span>
          </div>
        </div>

        <div className="ai-item">
          <span>!</span>

          <p>
            {analysis.followUps.length > 0 ? (
              <>
                <strong>
                  {analysis.followUps.length}
                </strong>{' '}
                client
                {analysis.followUps.length === 1
                  ? ''
                  : 's'} may be due for a
                follow-up.
              </>
            ) : (
              <>
                No clients currently meet the
                42-day follow-up rule.
              </>
            )}
          </p>
        </div>

        <div className="ai-item">
          <span>★</span>

          <p>
            You have{' '}
            <strong>
              {analysis.highValueClients.length}
            </strong>{' '}
            client
            {analysis.highValueClients.length === 1
              ? ''
              : 's'} with at least $300 in
            recorded spending.
          </p>
        </div>

        <div className="ai-item">
          <span>💅</span>

          <p>
            Most-booked service:{' '}
            <strong>
              {analysis.popularService
                ? analysis.popularService[0]
                : 'Not enough data'}
            </strong>

            {analysis.popularService && (
              <>
                {' '}
                (
                {analysis.popularService[1]}{' '}
                appointments)
              </>
            )}
          </p>
        </div>

        <div className="ai-item">
          <span>📊</span>

          <p>
            The system has recorded{' '}
            <strong>
              $
              {analysis.totalCompletedRevenue.toFixed(
                0,
              )}
            </strong>{' '}
            in completed appointment revenue.
          </p>
        </div>

        {(analysis.cancelledCount > 0 ||
          analysis.noShowCount > 0) && (
          <div className="ai-item">
            <span>⚠</span>

            <p>
              Recorded appointment issues:{' '}
              <strong>
                {analysis.cancelledCount}
              </strong>{' '}
              cancelled and{' '}
              <strong>
                {analysis.noShowCount}
              </strong>{' '}
              no-show
              {analysis.noShowCount === 1
                ? ''
                : 's'}
              .
            </p>
          </div>
        )}
      </div>

      <div className="ai-client-list">
        <h3>Priority follow-ups</h3>

        {analysis.followUps.length === 0 ? (
          <p className="muted">
            No clients currently need attention.
          </p>
        ) : (
          analysis.followUps
            .slice(0, 5)
            .map((client) => (
              <div
                className="ai-client"
                key={client.id}
              >
                <div>
                  <strong>
                    {client.name}
                  </strong>

                  <small>
                    {client.daysSinceVisit} days
                    since last visit
                  </small>

                  <small>
                    Favorite:{' '}
                    {client.favoriteService ||
                      'Not recorded'}
                  </small>

                  <span
                    className={`ai-priority ai-priority-${client.priority.toLowerCase()}`}
                  >
                    {client.priority} priority
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    createDraftMessage(client)
                  }
                >
                  Draft Message
                </button>
              </div>
            ))
        )}
      </div>

      <div className="ai-business-overview">
        <h3>Business overview</h3>

        <div className="ai-overview-grid">
          <div>
            <strong>
              {analysis.repeatClients.length}
            </strong>

            <span>Repeat clients</span>
          </div>

          <div>
            <strong>
              {analysis.newClients.length}
            </strong>

            <span>New clients</span>
          </div>

          <div>
            <strong>
              {analysis.upcomingAppointments.length}
            </strong>

            <span>Upcoming</span>
          </div>
        </div>
      </div>

      {selectedMessage && (
        <div className="ai-message-box">
          <div className="ai-message-header">
            <div>
              <h3>Suggested Message</h3>

              <p>
                Generated locally from client
                information.
              </p>
            </div>

            <button
              type="button"
              className="modal-close"
              onClick={closeMessage}
              aria-label="Close message"
            >
              ×
            </button>
          </div>

          <textarea
            value={selectedMessage}
            onChange={(event) =>
              setSelectedMessage(
                event.target.value,
              )
            }
            rows={7}
          />

          <div className="ai-message-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={closeMessage}
            >
              Close
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigator.clipboard?.writeText(
                  selectedMessage,
                )
              }
            >
              Copy Message
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default AIAssistant;

import { useEffect, useMemo, useState } from 'react';
import type {
  Appointment,
  Client,
  Service,
  SalonData,
} from './types/salon';

import Sidebar from './components/Sidebar';
import StatsCards from './components/StatsCards';
import AIAssistant from './components/AIAssistant';
import AppointmentList from './components/AppointmentList';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import AppointmentForm from './components/AppointmentForm';

import {
  loadSalonData,
  saveSalonData,
} from './utils/storage';

import {
  getTodayString,
  formatLongDate,
} from './utils/date';

function App() {
  const [activeSection, setActiveSection] =
    useState('dashboard');

  const [salonData, setSalonData] =
    useState<SalonData>(() => loadSalonData());

  const [editingClient, setEditingClient] =
    useState<Client | undefined>(undefined);

  const [
    editingAppointment,
    setEditingAppointment,
  ] = useState<Appointment | undefined>(
    undefined,
  );

  const [showClientForm, setShowClientForm] =
    useState(false);

  const [
    showAppointmentForm,
    setShowAppointmentForm,
  ] = useState(false);

  useEffect(() => {
    saveSalonData(salonData);
  }, [salonData]);

  const today = getTodayString();

  /*
   * =========================================
   * TODAY'S APPOINTMENTS
   * =========================================
   */

  const todaysAppointments = useMemo(
    (): Appointment[] =>
      salonData.appointments
        .filter(
          (appointment) =>
            appointment.date === today &&
            appointment.status !== 'Cancelled',
        )
        .sort((a, b) =>
          a.time.localeCompare(b.time),
        ),
    [salonData.appointments, today],
  );

  /*
   * =========================================
   * TODAY'S REVENUE
   * =========================================
   */

  const todaysRevenue = useMemo(
    (): number =>
      todaysAppointments
        .filter(
          (appointment) =>
            appointment.status === 'Completed',
        )
        .reduce(
          (sum, appointment) =>
            sum + Number(appointment.price || 0),
          0,
        ),
    [todaysAppointments],
  );

  /*
   * =========================================
   * CLIENT FOLLOW-UPS
   * =========================================
   */

  const followUps = useMemo((): number => {
    const currentDate = new Date(
      `${today}T00:00:00`,
    );

    return salonData.clients.filter(
      (client) => {
        if (!client.lastVisit) {
          return false;
        }

        const lastVisit = new Date(
          `${client.lastVisit}T00:00:00`,
        );

        const days =
          (currentDate.getTime() -
            lastVisit.getTime()) /
          (1000 * 60 * 60 * 24);

        return days >= 42;
      },
    ).length;
  }, [salonData.clients, today]);

  /*
   * =========================================
   * CLIENT FUNCTIONS
   * =========================================
   */

  function handleNewClient() {
    setEditingClient(undefined);
    setShowClientForm(true);
  }

  function handleEditClient(client: Client) {
    setEditingClient(client);
    setShowClientForm(true);
  }

  function handleSaveClient(client: Client) {
    setSalonData((currentData) => {
      const exists =
        currentData.clients.some(
          (item) => item.id === client.id,
        );

      return {
        ...currentData,

        clients: exists
          ? currentData.clients.map(
              (item) =>
                item.id === client.id
                  ? client
                  : item,
            )
          : [
              ...currentData.clients,
              client,
            ],
      };
    });

    setShowClientForm(false);
    setEditingClient(undefined);
  }

  function handleDeleteClient(
    client: Client,
  ) {
    const confirmed = window.confirm(
      `Delete ${client.name}?\n\nThis will also remove their appointments.`,
    );

    if (!confirmed) {
      return;
    }

    setSalonData((currentData) => ({
      ...currentData,

      clients:
        currentData.clients.filter(
          (item) => item.id !== client.id,
        ),

      appointments:
        currentData.appointments.filter(
          (appointment) =>
            appointment.clientId !== client.id,
        ),
    }));
  }

  /*
   * =========================================
   * APPOINTMENT FUNCTIONS
   * =========================================
   */

  function handleNewAppointment() {
    setEditingAppointment(undefined);
    setShowAppointmentForm(true);
  }

  function handleEditAppointment(
    appointment: Appointment,
  ) {
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  }

  function handleSaveAppointment(
    appointment: Appointment,
  ) {
    setSalonData((currentData) => {
      const exists =
        currentData.appointments.some(
          (item) => item.id === appointment.id,
        );

      return {
        ...currentData,

        appointments: exists
          ? currentData.appointments.map(
              (item) =>
                item.id === appointment.id
                  ? appointment
                  : item,
            )
          : [
              ...currentData.appointments,
              appointment,
            ],
      };
    });

    setShowAppointmentForm(false);
    setEditingAppointment(undefined);
  }

  function handleDeleteAppointment(
    appointment: Appointment,
  ) {
    const confirmed = window.confirm(
      `Delete the appointment for ${appointment.clientName} on ${appointment.date}?`,
    );

    if (!confirmed) {
      return;
    }

    setSalonData((currentData) => ({
      ...currentData,

      appointments:
        currentData.appointments.filter(
          (item) =>
            item.id !== appointment.id,
        ),
    }));
  }

  /*
   * =========================================
   * PAGE TITLE
   * =========================================
   */

  const pageTitle =
    activeSection === 'dashboard'
      ? 'Good morning'
      : activeSection === 'ai'
        ? 'AI Business Assistant'
        : activeSection === 'appointments'
          ? 'Appointments'
          : activeSection === 'clients'
            ? 'Clients'
            : activeSection === 'services'
              ? 'Services'
              : activeSection;

  /*
   * =========================================
   * RENDER
   * =========================================
   */

  return (
    <div className="app-shell">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>{pageTitle}</h2>

            <p>
              {activeSection ===
              'dashboard'
                ? 'Your nail salon business at a glance'
                : activeSection === 'ai'
                  ? 'Business insights based on your local salon data'
                  : activeSection ===
                      'appointments'
                    ? 'Manage your salon appointment schedule'
                    : activeSection ===
                        'clients'
                      ? 'Manage your salon clients'
                      : activeSection ===
                          'services'
                        ? 'Your salon service menu'
                        : 'Salon management'}
            </p>
          </div>

          <div className="topbar-date">
            {formatLongDate(today)}
          </div>
        </header>

        {/* ===================================
            DASHBOARD
            =================================== */}

        {activeSection === 'dashboard' && (
          <>
            <StatsCards
              appointments={
                todaysAppointments.length
              }
              clients={
                salonData.clients.length
              }
              revenue={todaysRevenue}
              followUps={followUps}
            />

            <div className="dashboard-grid">
              <AppointmentList
                appointments={
                  todaysAppointments
                }
                onNewAppointment={
                  handleNewAppointment
                }
                onEditAppointment={
                  handleEditAppointment
                }
                onDeleteAppointment={
                  handleDeleteAppointment
                }
              />

              <AIAssistant
                salonData={salonData}
              />
            </div>

            <ClientList
              clients={salonData.clients}
              onNewClient={handleNewClient}
              onEditClient={handleEditClient}
              onDeleteClient={
                handleDeleteClient
              }
            />
          </>
        )}

        {/* ===================================
            APPOINTMENTS
            =================================== */}

        {activeSection ===
          'appointments' && (
          <AppointmentList
            appointments={
              salonData.appointments
            }
            onNewAppointment={
              handleNewAppointment
            }
            onEditAppointment={
              handleEditAppointment
            }
            onDeleteAppointment={
              handleDeleteAppointment
            }
          />
        )}

        {/* ===================================
            CLIENTS
            =================================== */}

        {activeSection === 'clients' && (
          <ClientList
            clients={salonData.clients}
            onNewClient={handleNewClient}
            onEditClient={handleEditClient}
            onDeleteClient={
              handleDeleteClient
            }
          />
        )}

        {/* ===================================
            AI ASSISTANT
            =================================== */}

        {activeSection === 'ai' && (
          <AIAssistant
            salonData={salonData}
          />
        )}

        {/* ===================================
            SERVICES
            =================================== */}

        {activeSection === 'services' && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Services</h2>

                <p>
                  Salon service menu
                </p>
              </div>
            </div>

            {salonData.services.length ===
            0 ? (
              <div className="empty-state">
                No services available.
              </div>
            ) : (
              <div className="service-grid">
                {salonData.services.map(
                  (service: Service) => (
                    <div
                      className="service-card"
                      key={service.id}
                    >
                      <div className="service-flower">
                        ✿
                      </div>

                      <h3>
                        {service.name}
                      </h3>

                      <p>
                        {service.duration}{' '}
                        minutes
                      </p>

                      <strong>
                        $
                        {service.price.toFixed(
                          0,
                        )}
                      </strong>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* =====================================
          CLIENT FORM
          ===================================== */}

      {showClientForm && (
        <ClientForm
          client={editingClient}
          onSave={handleSaveClient}
          onCancel={() => {
            setShowClientForm(false);
            setEditingClient(undefined);
          }}
        />
      )}

      {/* =====================================
          APPOINTMENT FORM
          ===================================== */}

      {showAppointmentForm && (
        <AppointmentForm
          appointment={editingAppointment}
          clients={salonData.clients}
          services={salonData.services}
          onSave={handleSaveAppointment}
          onCancel={() => {
            setShowAppointmentForm(false);
            setEditingAppointment(
              undefined,
            );
          }}
        />
      )}
    </div>
  );
}

export default App;

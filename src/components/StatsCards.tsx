interface StatsCardsProps {
  appointments: number;
  clients: number;
  revenue: number;
  followUps: number;
}

function StatsCards({
  appointments,
  clients,
  revenue,
  followUps,
}: StatsCardsProps) {
  const cards = [
    {
      label: "Today's Appointments",
      value: appointments.toString(),
      icon: '📅',
    },
    {
      label: 'Total Clients',
      value: clients.toString(),
      icon: '👩',
    },
    {
      label: "Today's Revenue",
      value: `$${revenue.toFixed(0)}`,
      icon: '💵',
    },
    {
      label: 'Follow-ups',
      value: followUps.toString(),
      icon: '💬',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className="stat-card" key={card.label}>
          <div className="stat-icon">{card.icon}</div>
          <div>
            <p>{card.label}</p>
            <h2>{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

function Sidebar({
  activeSection,
  onSectionChange,
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⌂' },
    { id: 'appointments', label: 'Appointments', icon: '◷' },
    { id: 'clients', label: 'Clients', icon: '♙' },
    { id: 'services', label: 'Services', icon: '✿' },
    { id: 'ai', label: 'AI Assistant', icon: '✦' },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">✿</div>
        <div>
          <h1>Nail Salon</h1>
          <p>AI Assistant</p>
        </div>
      </div>

      <nav>
        {menuItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`nav-item ${
              activeSection === item.id ? 'active' : ''
            }`}
            onClick={() => onSectionChange(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="local-badge">
          <span>●</span>
          Local Only
        </div>

        <p>
          V1 stores salon data locally in this browser.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;

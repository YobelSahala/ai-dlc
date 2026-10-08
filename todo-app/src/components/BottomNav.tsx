import { NavLink } from 'react-router-dom';

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    to: '/calendar',
    label: 'Calendar',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    to: '/tasks/new',
    label: 'Add Task',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden"
    >
      <ul className="flex items-center justify-around h-16">
        {navItems.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              aria-label={label}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center gap-1 px-4 py-2',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded',
                  isActive ? 'text-primary' : 'text-gray-400',
                ].join(' ')
              }
            >
              {icon}
              <span className="text-xs">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

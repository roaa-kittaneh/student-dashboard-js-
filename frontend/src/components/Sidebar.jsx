import { NavLink, useNavigate } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import {
  IconHome,
  IconList,
  IconLogout,
  IconPlus,
} from './Icons.jsx';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/dashboard',                  label: 'Dashboard',   end: true,  Icon: IconHome },
  { to: '/dashboard/students',         label: 'Students',                Icon: IconList },
  { to: '/dashboard/students/add',     label: 'Add Student',             Icon: IconPlus },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 md:hidden transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 transform transition-transform
          bg-navy-900 text-slate-200 flex flex-col
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Profile block — text-only initials avatar (no image) */}
        <div className="px-5 pt-7 pb-6 flex items-center gap-3">
          <Avatar name={user?.name} email={user?.email} size="lg" />
          <div className="min-w-0">
            <div className="font-semibold text-white truncate">
              {user?.name || 'Student User'}
            </div>
            <div className="text-xs text-slate-400 truncate">{user?.email}</div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {links.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <IconLogout size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

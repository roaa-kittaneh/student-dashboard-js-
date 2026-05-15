import { useTheme } from '../hooks/useTheme';
import { IconMenu, IconMoon, IconSun } from './Icons.jsx';

/**
 * Slim header — page title + theme toggle. Logout lives in the sidebar.
 */
export default function Header({ onMenu, title, subtitle }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="flex items-center justify-between gap-4 px-2 md:px-0 py-4 md:py-2">
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-navy-700"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <IconMenu />
        </button>
        <div className="min-w-0">
          {title && (
            <h1 className="text-xl md:text-2xl font-semibold leading-tight truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="w-9 h-9 inline-flex items-center justify-center rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-navy-700"
      >
        {theme === 'dark' ? <IconSun /> : <IconMoon />}
      </button>
    </header>
  );
}

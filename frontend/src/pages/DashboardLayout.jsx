import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-screen bg-slate-200 dark:bg-navy-950 md:p-6 overflow-hidden">
      <div className="h-full md:rounded-2xl md:shadow-xl overflow-hidden flex bg-navy-900">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-navy-900">
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {/* Pages render their own header so they can pass title/subtitle */}
            <Outlet context={{ openSidebar: () => setOpen(true) }} />
          </main>
        </div>
      </div>
    </div>
  );
}

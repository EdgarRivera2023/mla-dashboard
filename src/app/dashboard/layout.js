// src/app/dashboard/layout.js
'use client';

import SignOutButton from '@/components/SignOutButton';
import SidebarNav from '@/components/SidebarNav';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import CasosProyectosPanel from '@/components/CasosProyectosPanel';
import CasosDetailFilterPanel from '@/components/CasosDetailFilterPanel';

const navigation = [
  { name: 'Panel', href: '/dashboard' },
  { name: 'Casos', href: '/dashboard/casos' },
  { name: 'Contactos', href: '/dashboard/contactos' },
  { name: 'Tareas', href: '/dashboard/tareas' },
  { name: 'Staff', href: '/dashboard/staff' },
  { name: 'Panel de Admin', href: '/dashboard/admin' },
];

function Sidebar() {
  const { sidebarView } = useSidebar();

  const renderSidebarContent = () => {
    switch(sidebarView) {
      case 'casosDashboard':
        return <CasosProyectosPanel />;
      case 'casosDetailFilters':
        return <CasosDetailFilterPanel />;
      case 'main':
      default:
        return <SidebarNav links={navigation} />;
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-800">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-2xl font-bold text-white">DataLink Web</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-6 py-4">
        {renderSidebarContent()}
      </nav>

      <div className="shrink-0">
        <div className="px-6 py-4 text-sm leading-6 text-gray-200 border-t border-slate-700">
          <p className="font-semibold">Edgar</p>
          <p className="text-xs font-light text-gray-400 mb-2">edgar.asistente.medina@gmail.com</p>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="h-screen flex">
        <div className="flex w-64 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>
        <main className="flex-1 pl-64">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SignOutButton from '../../components/SignOutButton';
import SidebarNav from '../../components/SidebarNav';

// Define our navigation structure with the new name "Panel"
const navLinks = [
  { name: 'Panel', href: '/dashboard' }, // <-- Changed from Dashboard
  { name: 'Casos', href: '/dashboard/casos' },
  { name: 'Contactos', href: '/dashboard/contactos' },
  { name: 'Tareas', href: '/dashboard/tareas' },
  { name: 'Staff', href: '/dashboard/staff', adminOnly: true },
  { name: 'Panel de Admin', href: '/dashboard/admin', adminOnly: true, isSeparator: true },
];

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  // Filter links based on user role
  const accessibleLinks = navLinks.filter(link => 
    !link.adminOnly || (link.adminOnly && userRole === 'admin')
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="relative w-64 flex-shrink-0 bg-gray-800 p-6 text-white flex flex-col">
        <h2 className="mb-8 text-2xl font-bold">DataLink Web</h2>
        
        {/* Using our SidebarNav component again */}
        <SidebarNav links={accessibleLinks} />

        <div className="mt-auto">
          <div className="mb-4 border-t border-gray-700"></div>
          <p className="mb-1 truncate text-sm font-medium">{session?.user?.name}</p>
          <p className="mb-4 truncate text-xs text-gray-400">{session?.user?.email}</p>
          <SignOutButton />
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
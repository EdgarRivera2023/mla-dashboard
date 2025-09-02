'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNav({ links }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1">
      <ul>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.name} className={`mb-2 ${link.isSeparator ? 'border-t border-gray-700 pt-4 mt-4' : ''}`}>
              <Link
                href={link.href}
                className={`block rounded py-2 px-3 ${
                  isActive
                    ? 'text-yellow-400 font-bold' // Style for the active link
                    : 'hover:bg-gray-700'       // Style for inactive links
                }`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
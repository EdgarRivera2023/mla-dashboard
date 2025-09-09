// src/components/SidebarNav.js
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

// The component now accepts a 'links' prop
export default function SidebarNav({ links }) {
  const pathname = usePathname();

  return (
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
      <li>
        <ul role="list" className="-mx-2 space-y-1">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.name}>
                <Link href={link.href}>
                  <span
                    className={`
                      ${isActive ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white hover:bg-slate-700'}
                      group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                    `}
                  >
                    {link.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    </ul>
  );
}
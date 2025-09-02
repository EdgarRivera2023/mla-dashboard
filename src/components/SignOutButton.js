'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="w-full rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
    >
      Sign Out
    </button>
  )
}
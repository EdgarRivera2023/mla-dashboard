'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function HomePage() {
  const { data: session } = useSession()

  if (session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">
          Welcome to the MLA Dashboard, {session.user.name}!
        </h1>
        <button 
          onClick={() => signOut()} 
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white"
        >
          Sign Out
        </button>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">
        MLA Dashboard
      </h1>
      <p className="mt-2 text-lg">
        Please sign in to continue.
      </p>
      <button 
        onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })} // <-- Change is here
        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        Sign In
      </button>
    </main>
  )
}
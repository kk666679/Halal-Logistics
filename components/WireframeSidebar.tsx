"use client";

import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

export default function WireframeSidebar() {
  const { logout } = useAuth()

  return (
    <aside className="w-64 border-r border-dashed border-gray-300 p-4 h-screen">
      <div className="space-y-4">
        <div className="text-lg font-bold border-b border-dashed border-gray-300 pb-2">Navigation</div>
        <div className="space-y-2">
          <Link href="/dashboard" className="block p-2 border border-dashed border-gray-300 rounded hover:bg-gray-100">Dashboard</Link>
          <Link href="/products" className="block p-2 border border-dashed border-gray-300 rounded hover:bg-gray-100">Inventory</Link>
          <Link href="/tracking" className="block p-2 border border-dashed border-gray-300 rounded hover:bg-gray-100">Tracking</Link>
          <Link href="/certification" className="block p-2 border border-dashed border-gray-300 rounded hover:bg-gray-100">Certification</Link>
          <Link href="/ai-agent" className="block p-2 border border-dashed border-gray-300 rounded hover:bg-gray-100">AI Agents</Link>
        </div>
        <div className="text-lg font-bold border-b border-dashed border-gray-300 pb-2 mt-8">Settings</div>
        <div className="space-y-2">
          <Link href="/profile" className="block p-2 border border-dashed border-gray-300 rounded hover:bg-gray-100">Profile</Link>
          <button onClick={logout} className="block w-full text-left p-2 border border-dashed border-gray-300 rounded hover:bg-gray-100">Logout</button>
        </div>
      </div>
    </aside>
  )
}

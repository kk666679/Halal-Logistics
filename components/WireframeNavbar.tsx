import Link from 'next/link'

export default function WireframeNavbar() {
  return (
    <nav className="border-b border-dashed border-gray-300 p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Halal Logistics</div>
        <div className="flex space-x-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
        </div>
      </div>
    </nav>
  )
}

import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Navbar() {
  const router = useRouter()

  const links = [
    { name: 'Inbox', href: '/inbox' },
    { name: 'Users', href: '/users' },
  ]

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/">
              <img src="https://encantia.xyz/icons/logo.webp" alt="Encantia Logo" className="h-10 w-10" />
            </Link>
          </div>

          <div className="hidden md:flex space-x-6">
            {links.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  router.pathname === link.href
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

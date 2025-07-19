import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <div className="text-gray-400 text-2xl">?</div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-light text-gray-900">
            Page not found
          </h2>
          <p className="text-gray-500 text-sm">
            The page you&apos;re looking for doesn&apos;t exist
          </p>
        </div>
        <Link href="/">
          <button className="px-8 py-3 bg-orange-400 text-white rounded-full font-light hover:bg-orange-500 transition-colors">
            Go home
          </button>
        </Link>
      </div>
    </div>
  )
}
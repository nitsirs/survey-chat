'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <div className="text-red-600 text-2xl">!</div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-light text-gray-900">
            Something went wrong
          </h2>
          <p className="text-gray-500 text-sm">
            An error occurred while loading the page
          </p>
        </div>
        <button
          onClick={reset}
          className="px-8 py-3 bg-orange-400 text-white rounded-full font-light hover:bg-orange-500 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}